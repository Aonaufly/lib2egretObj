module lib2egret.mvc {
    export class NotificationDispatcher extends egret.EventDispatcher {
        public send<T>($type: string, $data: T): Promise<boolean> {
            return new Promise<boolean>((resolve, reject): void => {
                if (this.hasEventListener($type)) {
                    const $event: NotificationEvent<T> = new NotificationEvent($type, $data);
                    this.dispatchEvent($event);
                }
                resolve(this.hasEventListener($type));
            });
        }
    }
}
