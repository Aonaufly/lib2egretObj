module lib2egret.mvc {
    /**
     * controller基类
     * @author Aonaufly
     */
    export abstract class BaseMvcController<T, V extends IMvcView<any>> implements IMvcController<T> {
        protected _view: V;
        protected _proxy: BaseMvcProxy;
        protected abstract get _key(): string;
        protected _maincode: number;
        protected _loadui: common.ILoading;
        protected _parent: egret.DisplayObjectContainer;
        protected _destroyRes: boolean = false;
        protected _notification: NotificationDispatcher;
        private _closeDestroy: boolean = false;
        private _viewConf: egret.XML;
        protected _wait: { $data: T, $router?: { module: string, type: Array<string> | string, data: JSON } };
        /**
         * 初始化数据请求是否完成（default：false）
         */
        protected _initNetWork: boolean = false;
        /**
         * 处理Http数据
         */
        protected onHttpHandler($tag: string, $type: lib2egret.network.TYPE_HTTP_CALLBACK, $data?: string): void { };


        public constructor($notification: NotificationDispatcher = null) {
            if ($notification)
                this._notification = $notification;
            else
                this._notification = MvcMgr.Instance.getNotification();
            this.init2NetWork();
            this.analysis2Conf();
            this.listener2Cmds(true);
        }
        private getModuleConf(): egret.XML {
            return MvcConfMgr.Instance.getModulesConf(this._key);
        }
        /**
         * 初始化NetWork通讯（拿到初始化信息）
         */
        protected abstract init2NetWork(): void;
        //解析配置
        private analysis2Conf(): void {
            const $conf: egret.XML = this.getModuleConf();
            this._viewConf = MvcConfMgr.Instance.getViewConf($conf);
            this._maincode = parseInt($conf[`$maincode`]);
            const $layoutIndex: number = parseInt($conf[`$layoutIndex`]);
            this._parent = common.GameLayoutMgr.Instance.getLayout($layoutIndex);
            this._closeDestroy = $conf[`$closeDestroy`] && +$conf[`$closeDestroy`] == 1;
            const $loadRes: boolean = MvcMgr.Instance.getModuleRes<T>(this._key);
            if (!$loadRes && $conf[`$loading`] && +<number>$conf[`$loading`] == 1) {
                let $loadingUI: string = $conf[`$loadingName`] && ($conf[`$loadingName`] as string).trim().length > 0 ?
                    ($conf[`$loadingName`] as string).trim() : null;
                this.loadModuleRespacket($loadingUI);
            } else {
                this._view = <V>BaseMvcController.creatView<T>(
                    this._viewConf[`$name`],
                    this._parent,
                    this._viewConf,
                    this.callback2View
                );
                this._viewConf = null;
                this.check2Init();
            }
            this._destroyRes = $conf[`$destroyRes`] && +<number>$conf[`$destroyRes`] == 1;
            let $pClass: any = egret.getDefinitionByName($conf[`$proxyName`]);
            this._proxy = new $pClass(this.callback2Proxy);
        }
        /**
         * 检测初始化是否完成
         */
        protected check2Init(): void {
            if (this._initNetWork && this._view) {
                this.loadingHandler(false);
                if (this._wait) {
                    this.show(this._wait.$data, this._wait.$router);
                    this._wait = null;
                }
            }
        }
        /**
         * 关闭后是否销毁
         */
        protected get CloseDestroy(): boolean {
            return this._closeDestroy;
        }

        /**
         * callback 2 Proxy
         */
        protected abstract callback2Proxy: ($type: string, $data?: any) => void;

        private loadModuleRespacket($loadingui?: string): void {
            if ($loadingui) {
                this.loadingHandler(true, $loadingui);
            }
            this.lisener2Res(true);
            RES.loadGroup(this._key);
        }

        private lisener2Res($isAdd: boolean): void {
            if ($isAdd) {
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResHandler, this);
                this._loadui && RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResHandler, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResHandler, this);
            } else {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResHandler, this);
                this._loadui && RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResHandler, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResHandler, this);
            }
        }

        /**
         * 处理LoadingUI
         * @param $isShow 是否显示loading界面
         * @param $loadingui loadingUI的引用对象
         */
        protected loadingHandler($isShow: boolean, $loadingui?: string): void {
            if ($isShow) {
                if (!this._loadui) {
                    let $lClass: any = egret.getDefinitionByName($loadingui);
                    this._loadui = new $lClass();
                    this._parent.addChild(this._loadui);
                }
            } else {
                if (this._loadui) {
                    common.CommonTool.remove4Parent(this._loadui);
                    this._loadui.destroy();
                    this._loadui = null;
                }
            }
        }
        private onResHandler($e: RES.ResourceEvent): void {
            if ($e.groupName != this._key) return;
            switch ($e.type) {
                case RES.ResourceEvent.GROUP_COMPLETE:
                    this.lisener2Res(false);
                    //初始化view
                    this._view = <V>BaseMvcController.creatView<T>(
                        this._viewConf[`$name`],
                        this._parent,
                        this._viewConf,
                        this.callback2View
                    );
                    this._viewConf = null;
                    this.check2Init();
                    break;
                case RES.ResourceEvent.GROUP_PROGRESS:
                    this._loadui.update($e.itemsTotal, $e.itemsLoaded);
                    break;
                case RES.ResourceEvent.GROUP_LOAD_ERROR:
                    console.error(`module ${this._key} res group no find!`);
                    break;
            }
        }

        /**
         * 注册命令
         */
        protected abstract get cmds(): Array<string>;

        private listener2Cmds($isAdd: boolean): void {
            if (this.cmds != null) {
                const $arr: Array<string> = this.cmds;
                $arr.forEach(($item: string): void => {
                    if ($isAdd) {
                        if (!this._notification.hasEventListener($item)) {
                            this._notification.addEventListener($item, this.onCmdsHandlers, this);
                        }
                    } else {
                        if (this._notification.hasEventListener($item)) {
                            this._notification.removeEventListener($item, this.onCmdsHandlers, this);
                        }
                    }
                });
            }
        }

        /**
         * 处理CMDs监听
         */
        protected abstract onCmdsHandlers($e: NotificationEvent<any>): void;

        /**
         * @inheritDoc
         */
        public open($data?: T, router?: { module: string, type: Array<string> | string, data: JSON }): void {
            if (this._view && this._initNetWork) {
                this.show($data, router);
            } else {
                this._wait = { $data: $data, $router: router };
            }
        }
        /**
         * 显示UI
         * @param $data 初始数据
         * @param router  路由数据
         */
        protected abstract show($data?: T, router?: { module: string, type: Array<string> | string, data: JSON }): void;
        /**
         * @inheritDoc
         * @param $destroy (default:true)
         */
        public close($destroy: boolean = false): Promise<boolean> {
            if (!$destroy) $destroy = this._closeDestroy;
            return new Promise<boolean>((resolve, reject): void => {
                if (!$destroy) {
                    this._view.close(false).then((): void => {
                        resolve($destroy);
                    }).catch(e => console.log(e));
                } else {
                    this.destroy();
                    resolve($destroy);
                }
            });
        }

        /**
         * @inheritDoc
         */
        public getNotification(): NotificationDispatcher {
            return this._notification;
        }

        /**
         * @inheritDoc
         */
        public getProxy(): BaseMvcProxy {
            return this._proxy;
        }

        /**
         * @inheritDoc
         */
        public getView(): IMvcView<T> {
            return this._view;
        }

        /**
         * view的callback
         */
        protected abstract callback2View: ($type: string, $data?: any) => void;
        /**
         * 主界面mask点击处理
         * @param $type 
         * @param $data 
         */
        protected viewMaskClick($type: string, $data?: any): boolean {
            if ($type != `maskClick` || !$data || $data != this._view) {
                return false;
            }
            this._view.close(this._closeDestroy);
            return true;
        }

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this.listener2Cmds(false);
            if (this._notification) {
                MvcMgr.Instance.putNotification(this._notification);
                this._notification = null;
            }
            if (this._proxy) {
                this._proxy.destroy();
                this._proxy = null;
            }
            if (this._view) {
                this._view.close(true).then((): void => {
                    if (this._destroyRes) {
                        RES.destroyRes(this._key);
                        MvcMgr.Instance.setModuleRes<T>(this._key, false);
                    }
                }).catch(e => console.log(e));
            }
        }

        /**
         * @ignore
         */
        protected static creatView<T>($name: string, $parent: egret.DisplayObjectContainer, $conf: egret.XML, $callback: ($type: string, $data?: any) => void): IMvcView<T> {
            let $vClass: IView<T> = egret.getDefinitionByName($name);
            return new $vClass($parent, $conf, $callback);
        }
    }
}


