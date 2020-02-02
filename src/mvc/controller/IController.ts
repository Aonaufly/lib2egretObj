module lib2egret.mvc {
    export interface IController<T> {
        new($notification?: NotificationDispatcher): IMvcController<T>;
    }

    export interface IMvcController<T> extends common.IDestroy {
        open($data?: T, router?: { module: string, type: Array<string> | string, data: JSON }): Promise<void>;
        close($destroy?: boolean): Promise<boolean>;
        getNotification(): NotificationDispatcher;
        getProxy(): BaseMvcProxy;
        getView(): IMvcView<T>;
    }
}
