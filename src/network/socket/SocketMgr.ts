module lib2egret.network {
    /**
     * Socket管理器
     * @author Aoanufly
     */
    export class SocketMgr extends common.BaseSingle {
        private _endian: string = egret.Endian.LITTLE_ENDIAN;
        private _socket: egret.WebSocket;
        private _crypto: ICrypto;
        private _serviceAdd: string;
        private _pool2Pak: common.Pool2Obj<BaseSocketPak<any, any>>;
        private _pool2SBy: common.Pool2Obj<SByteArray>;
        private _curPak: BaseSocketPak<any, any>;
        private _pak: ISocketPak<any, any>;

        /**
         * 获取单例对象句柄
         */
        public static get Instance(): SocketMgr {
            if (!SocketMgr._instance)
                SocketMgr._instance = new SocketMgr();
            return <SocketMgr>SocketMgr._instance;
        }
        private constructor() {
            super();
            this._socket = new egret.WebSocket();
            this._socket.type = egret.WebSocket.TYPE_BINARY;
            this._pool2Pak = new common.Pool2Obj<BaseSocketPak<any, any>>(4);
            this._pool2SBy = new common.Pool2Obj<SByteArray>(4);
        }
        private listener($isAdd: boolean): void {
            if ($isAdd) {
                !this._socket.hasEventListener(egret.ProgressEvent.SOCKET_DATA) && this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
                !this._socket.hasEventListener(egret.Event.CONNECT) && this._socket.addEventListener(egret.Event.CONNECT, this.onSocketEvent, this);
                !this._socket.hasEventListener(egret.Event.CLOSE) && this._socket.addEventListener(egret.Event.CLOSE, this.onSocketEvent, this);
                !this._socket.hasEventListener(egret.IOErrorEvent.IO_ERROR) && this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            } else {
                this._socket.hasEventListener(egret.ProgressEvent.SOCKET_DATA) && this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
                this._socket.hasEventListener(egret.Event.CONNECT) && this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketEvent, this);
                this._socket.hasEventListener(egret.Event.CLOSE) && this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketEvent, this);
                this._socket.hasEventListener(egret.IOErrorEvent.IO_ERROR) && this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            }
        }

        private onReceiveMessage($e: egret.ProgressEvent): void {
            if (!this._curPak) {
                let $sby: SByteArray = this.getSBy();
                this._curPak = this.getPak($sby);
            }
            this._socket.readBytes(this._curPak.Bytes);
            this.handlerData();
        }

        private handlerData: () => void = (): void => {
            if (!this._curPak) return;
            const $data: { over: boolean, $surplus?: SByteArray } = this._curPak.check2Receive();
            if (!$data) return;
            if ($data.over) {
                if (!$data.$surplus) {
                    this._curPak = null;
                } else {
                    $data.$surplus.position = $data.$surplus.length;
                    this._curPak = this.getPak($data.$surplus);
                    this.handlerData();
                }
            }
        };


        private onSocketEvent($e: egret.Event): void {
            switch ($e.type) {
                case egret.Event.COMPLETE:
                    SocketDispatcher.Instance.send<any>(SocketEvent.___SOCKET_CONNECT);
                    break;
                case egret.Event.CLOSE:
                    SocketDispatcher.Instance.send<any>(SocketEvent.___SOCKET_CLOSE);
                    break;
            }
        }
        private onSocketError($e: egret.IOErrorEvent): void {
            this.listener(false);
            SocketDispatcher.Instance.send<any>(SocketEvent.___SOCKET_ERROR, $e.data);
        }

        /**
         * 设置大小端
         * @param $endian 大小端
         */
        public set Endian($endian: string) {
            if (this._endian != $endian) {
                this._endian = $endian;
            }
        }

        /**
         * 获取大小端
         */
        public get Endian(): string {
            return this._endian;
        }

        /**
         * 发送信息
         * @param $head 包头
         * @param $body 包体
         */
        public send<HEAD extends ISocketHead, BODY>($head: HEAD, $body: BODY): boolean {
            if (this._socket.connected) {
                const $data: BaseSocketPak<HEAD, BODY> = this.getPak(this.getSBy());
                $data.getSendData($head, $body);
                this._socket.writeBytes($data.Bytes, 0, $data.Bytes.bytesAvailable);
                this._socket.flush();
                this.put($data);
                return true;
            } else {
                return false;
            }
        }

        /**
         * 初始化
         * @param $serviceAdd 服务器地址
         * @param $pak 包
         * @param $crypto 加密
         */
        public init<HEAD extends ISocketHead, BODY>($serviceAdd: string, $pak: ISocketPak<HEAD, BODY>, $crypto: ICrypto = null): void {
            this._crypto = $crypto;
            this._pak = $pak;
            this._serviceAdd = $serviceAdd;
        }
        private open(): void {
            this.listener(true);
            if (this._serviceAdd.indexOf(`ws`) > 0) {
                this._socket.connectByUrl(this._serviceAdd);
            } else {
                let $arr: Array<string> = this._serviceAdd.split(":");
                this._socket.connect($arr[0].trim(), parseInt($arr[1]));
            }
        }

        /**
         * 连接服务器
         */
        public startConnect(): void {
            if (!this._socket.connected) {
                this.open();
            }
        }

        /**
         * 关闭连接
         */
        public close(): void {
            if (this._socket.connected) {
                this.listener(false);
                this._socket.close();
            }
        }

        /**
         * 获取二进制数据对象
         */
        public getSBy(): SByteArray {
            let $cell: SByteArray = this._pool2SBy.Cell;
            if (!$cell) {
                $cell = new SByteArray();
            } else {
                $cell.reset();
            }
            return $cell;
        }

        /**
         * 获取Socket包
         * @param $sby 二进制对象
         */
        public getPak<HEAD extends ISocketHead, BODY>($sby: SByteArray): BaseSocketPak<HEAD, BODY> {
            let $cell: BaseSocketPak<HEAD, BODY> = this._pool2Pak.Cell;
            if (!$cell) {
                $cell = new this._pak($sby, this._crypto);
            } else {
                $cell.resetByte($sby);
            }
            return $cell;
        }

        /**
         * 放入对象池
         * @param $cell BaseSocketPak<HEAD,BODY> | SByteArray
         */
        public put<HEAD extends ISocketHead, BODY>($cell: BaseSocketPak<HEAD, BODY> | SByteArray): void {
            if ($cell instanceof SByteArray) {
                this._pool2SBy.put($cell);
            } else {
                this._pool2SBy.put($cell.Bytes);
                if (!this._pool2Pak.put($cell)) {
                    $cell.destroy();
                }
            }
        }
    }

    /**
     * 包头数据基类
     * @author Aonaufly
     */
    export interface ISocketHead {
        /**包体长度*/
        _bodyLen: number;
    }
}
