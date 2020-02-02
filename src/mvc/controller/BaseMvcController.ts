module lib2egret.mvc {
    /**
     * controller基类
     * @author Aonaufly
     */
    export abstract class BaseMvcController<T> implements IMvcController<T> {
        protected _view: IMvcView<any>;
        protected _proxy: BaseMvcProxy;
        protected abstract get _key(): string;
        protected _loadui: common.ILoading;
        protected _parent: egret.DisplayObjectContainer;
        protected _destroyRes: boolean = false;
        protected _notification: NotificationDispatcher;
        private _closeDestroy: boolean = false;
        private _viewConf: egret.XML;
        public constructor($notification: NotificationDispatcher = null) {
            if ($notification)
                this._notification = $notification;
            else
                this._notification = MvcMgr.Instance.getNotification();
            this.analysis2Conf();
            this.listener2Cmds(true);
        }
        private getModuleConf(): egret.XML {
            return MvcConfMgr.Instance.getModulesConf(this._key);
        }
        //解析配置
        private analysis2Conf(): void {
            const $conf: egret.XML = this.getModuleConf();
            this._viewConf = MvcConfMgr.Instance.getViewConf($conf);
            const $layoutIndex: number = parseInt($conf[`$layoutIndex`]);
            this._parent = common.GameLayoutMgr.Instance.getLayout($layoutIndex);
            this._closeDestroy = $conf[`$closeDestroy`] && +$conf[`$closeDestroy`] == 1;
            const $loadRes: boolean = MvcMgr.Instance.getModuleRes<T>(this._key);
            if (!$loadRes && $conf[`$loading`] && +<number>$conf[`$loading`] == 1) {
                let $loadingUI: string = $conf[`$loadingName`] && ($conf[`$loadingName`] as string).trim().length > 0 ?
                    ($conf[`$loadingName`] as string).trim() : null;
                this.loadModuleRespacket($loadingUI);
            } else {
                this._view = BaseMvcController.creatView<T>(
                    this._viewConf[`$name`],
                    this._parent,
                    this._viewConf,
                    this.callback2View
                );
                this._viewConf = null;
            }
            this._destroyRes = $conf[`$destroyRes`] && +<number>$conf[`$destroyRes`] == 1;
            let $pClass: any = egret.getDefinitionByName($conf[`$proxyName`]);
            this._proxy = new $pClass(this.callback2Proxy);
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
                    this.loadingHandler(false);
                    //初始化view
                    this._view = BaseMvcController.creatView<T>(
                        this._viewConf[`$name`],
                        this._parent,
                        this._viewConf,
                        this.callback2View
                    );
                    this._viewConf = null;
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
        public abstract open($data?: T, router?: { module: string, type: Array<string> | string, data: JSON }): Promise<void>;

        /**
         * @inheritDoc
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


