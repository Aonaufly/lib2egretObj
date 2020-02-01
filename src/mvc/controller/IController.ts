module lib2egret.mvc {
    export interface IController<T> {
        new($parent: egret.DisplayObjectContainer, $notification?: NotificationDispatcher): IMvcController<T>;
    }

    export interface IMvcController<T> extends common.IDestroy {
        open($data?: T, router?: string): Promise<void>;
        close($destroy?: boolean): Promise<boolean>;
        getNotification(): NotificationDispatcher;
        getProxy(): BaseMvcProxy;
        getView(): IMvcView<T>;
    }
}
