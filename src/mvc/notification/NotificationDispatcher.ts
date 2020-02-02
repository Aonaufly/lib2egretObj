module lib2egret.mvc {
    /**
     * MVC模块通信主题
     * @author Aonaufly
     */
    export class NotificationDispatcher extends egret.EventDispatcher {
        /**
         * 发送信息
         * @param $type 信息类型
         * @param $data 信息数据
         */
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
