module lib2egret.mvc {
    /**
     * @ignore
     */
    export interface IController<T> {
        new($notification?: NotificationDispatcher): IMvcController<T>;
    }

    /**
     * MVC Controller接口
     * @author Aonaufly
     */
    export interface IMvcController<T> extends common.IDestroy {
        /**
         * 开启
         * @param $data 开启数据
         * @param router 路由数据
         */
        open($data?: T, router?: { module: string, type: Array<string> | string, data: JSON }): Promise<void>;

        /**
         * 关闭
         * @param $destroy 是否销毁对象
         */
        close($destroy?: boolean): Promise<boolean>;

        /**
         * 获得notification对象
         */
        getNotification(): NotificationDispatcher;

        /**
         * 获得model的代理类
         */
        getProxy(): BaseMvcProxy;

        /**
         * 获取View
         */
        getView(): IMvcView<T>;
    }
}
