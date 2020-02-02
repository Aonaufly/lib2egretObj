module lib2egret.mvc {
    /**
     * Mvc管理器
     * @author Aonaufly
     */
    export class MvcMgr extends common.BaseSingle {
        /**
         * 获取单例对象句柄
         */
        public static get Instance(): MvcMgr {
            if (!MvcMgr._instance)
                MvcMgr._instance = new MvcMgr();
            return <MvcMgr>MvcMgr._instance;
        }


        private _list2Controllers: common.HashMap<IController<any>, IMvcController<any>>;
        private _pool2Notifications: common.Pool2Obj<NotificationDispatcher>;
        private _moduleResLoaded: common.HashMap<IController<any>, boolean>;
        private constructor() {
            super();
            this._list2Controllers = new common.HashMap<IController<any>, IMvcController<any>>();
            this._pool2Notifications = new common.Pool2Obj<NotificationDispatcher>(5);
            this._moduleResLoaded = new common.HashMap<IController<any>, boolean>();
        }

        /**
         * 打开模块
         * @param $moduleKey 模块id或者引用对象
         * @param $data 开启数据
         * @param $router 路由数据
         */
        public openController<T>($moduleKey: IController<any> | string, $data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): void {
            let $controller: IMvcController<T> = this.getController<T>($moduleKey);
            $controller.open($data, $router);
        }

        private getDefinition<T>($moduleKey: IController<T> | string): IController<T> {
            if (typeof $moduleKey == `string`) {
                const $conf: egret.XML = MvcConfMgr.Instance.getModulesConf($moduleKey as string);
                return egret.getDefinitionByName(($conf[`$name`] as string).trim());
            }
            else
                return $moduleKey as IController<T>;
        }

        /**
         * 关闭模块
         * @param $moduleKey 模块id或者引用对象
         * @param $isDestroy 是否销毁
         */
        public closeController<T>($moduleKey: IController<T> | string, $isDestroy: boolean = false): Promise<void> {
            return new Promise<void>((resolve, reject): void => {
                let $definition: IController<T> = this.getDefinition<T>($moduleKey);
                if (this.hasController($definition)) {
                    let $controller: IMvcController<T> = this.getController<T>($definition, null);
                    $controller.close($isDestroy).then(($destory: boolean): void => {
                        if ($destory) this._list2Controllers.remove($definition);
                    }).catch(e => console.log(e));
                }
                resolve();
            });
        }

        /**
         * 获取模块中的主题
         * @param $moduleKey 模块id或者引用对象
         */
        public getNotification4Controller($moduleKey: IController<any> | string): NotificationDispatcher {
            let $definition: IController<any> = this.getDefinition<any>($moduleKey);
            if (this.hasController($definition)) {
                let $controller: IMvcController<any> = this.getController<any>($definition, null);
                return $controller.getNotification();
            }
            return null;
        }

        /**
         * 获取主题
         */
        public getNotification(): NotificationDispatcher {
            let $cell: NotificationDispatcher = this._pool2Notifications.Cell;
            if ($cell)
                return $cell;
            $cell = new NotificationDispatcher();
            return $cell;
        }

        /**
         * 将主题放入池子
         * @param $cell 主题
         */
        public putNotification($cell: NotificationDispatcher) {
            this._pool2Notifications.put($cell);
        }

        /**
         * 获取模块中的model代理类
         * @param $moduleKey 模块id或者引用对象
         */
        public getProxy4Controller($moduleKey: IController<any> | string): BaseMvcProxy {
            let $definition: IController<any> = this.getDefinition<any>($moduleKey);
            if (this.hasController($definition)) {
                let $controller: IMvcController<any> = this.getController<any>($definition, null);
                return $controller.getProxy();
            }
            return null;
        }

        /**
         * 获取一个controller类
         * @param $moduleKey 模块id或者引用对象
         * @param $notification 主题
         */
        public getController<T>($moduleKey: IController<T> | string, $notification?: NotificationDispatcher): IMvcController<T> {
            let $definition: IController<T> = this.getDefinition<T>($moduleKey);
            if (this.hasController($definition))
                return this._list2Controllers.getValue($definition);
            return this.createController<T>($definition, $notification);
        }

        private createController<T>($definition: IController<T>, $notification: NotificationDispatcher): IMvcController<T> {
            let $controller: IMvcController<T> = new $definition($notification);
            this._list2Controllers.add($definition, $controller);
            return $controller;
        }

        /**
         * 是否存在此模块
         * @param $moduleKey $notification
         */
        public hasController($moduleKey: IController<any>): boolean {
            return this._list2Controllers.containsKey($moduleKey);
        }

        /**
         * 获取模块中的View
         * @param $moduleKey 模块id或者引用对象
         */
        public getView<T>($moduleKey: IController<T> | string): IMvcView<T> {
            let $definition: IController<any> = this.getDefinition<any>($moduleKey);
            if (this.hasController($definition)) {
                let $controller: IMvcController<any> = this.getController<any>($definition, null);
                return $controller.getView();
            }
            return null;
        }

        /**
         * @ignore
         */
        public setModuleRes<T>($moduleKey: string, $loaded: boolean): void {
            let $definition: IController<T> = this.getDefinition<T>($moduleKey);
            if (this._moduleResLoaded.containsKey($definition)) {
                if (!$loaded) {
                    this._moduleResLoaded.remove($definition);
                } else {
                    this._moduleResLoaded.add($definition, $loaded, true);
                }
            } else {
                if ($loaded) {
                    this._moduleResLoaded.add($definition, $loaded);
                }
            }
        }

        /**
         * @ignore
         */
        public getModuleRes<T>($moduleKey: string): boolean {
            let $definition: IController<T> = this.getDefinition<T>($moduleKey);
            if (this._moduleResLoaded.containsKey($definition)) {
                return this._moduleResLoaded.getValue($definition);
            }
            return false;
        }
    }
}
