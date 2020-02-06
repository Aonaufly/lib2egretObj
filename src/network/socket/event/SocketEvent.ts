module lib2egret.network {
    /**
     * Socket基础数据Event
     * T : 默认{head: HEAD, body: BODY , cell: BaseSocketPak<HEAD,BODY>}
     * @author Aoanufly
     */
    export class SocketEvent<T> extends egret.Event {
        /**Socket 连接完成*/
        public static readonly ___SOCKET_CONNECT: string = `socket_connect`;
        /**Socket 已关闭*/
        public static readonly ___SOCKET_CLOSE: string = `socket_close`;
        /**Socket 连接出错*/
        public static readonly ___SOCKET_ERROR: string = `socket_error`;
        /**socket 返回数据*/
        public static readonly ___SOCKET_DATA: string = `socket_data`;

        public constructor($type: string, $data?: T) {
            super($type, true, true, $data);
        }

        /**
         * 获取数据
         */
        public get Data(): T {
            return this.data;
        }
    }
}
