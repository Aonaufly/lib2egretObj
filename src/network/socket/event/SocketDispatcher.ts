module lib2egret.network {
    /**
     * Socket基本信息主题
     * @author Aonaufly
     */
    export class SocketDispatcher extends egret.EventDispatcher {
        private static _instance: SocketDispatcher;

        /**
         * 获取单例对象句柄
         */
        public static get Instance(): SocketDispatcher {
            if (!SocketDispatcher._instance)
                SocketDispatcher._instance = new SocketDispatcher();
            return SocketDispatcher._instance;
        }

        private constructor() {
            super();
        }

        /**
         * @ignore
         */
        public send<T>($type: string, $data?: T): void {
            if (this.hasEventListener($type)) {
                let $event: SocketEvent<T> = new SocketEvent($type, $data);
                this.dispatchEvent($event);
            }
        }
    }
}
