module lib2egret.network {
    /**
     * Socket消息处理
     * @author Aoanufly
     */
    export class SocketMsgMgr extends common.BaseSingle {
        public static get Instance(): SocketMsgMgr {
            if (!SocketMsgMgr._instance)
                SocketMsgMgr._instance = new SocketMsgMgr();
            return <SocketMsgMgr>SocketMsgMgr._instance;
        }

        private _heart: { head: any, body: any };
        private _sesond: number;
        private _receive: number;
        private readonly _heartsendcdkey: string = `_heartsendcdkey`;
        private readonly _heartreceivecdkey: string = `_heartreceivecdkey`;
        private _distribute: BaseSocketDistribute<any>;

        private constructor() {
            super();
            SocketDispatcher.Instance.addEventListener(SocketEvent.___SOCKET_CLOSE, this.onSocketEvent, this);
            SocketDispatcher.Instance.addEventListener(SocketEvent.___SOCKET_DATA, this.onSocketEvent, this);
            SocketDispatcher.Instance.addEventListener(SocketEvent.___SOCKET_CONNECT, this.onSocketEvent, this);
        }

        private onSocketEvent($e: SocketEvent<any>): void {
            switch ($e.type) {
                case SocketEvent.___SOCKET_CLOSE:
                    if (!this._heart || this._sesond < 0)
                        return;
                    common.TimerMgr.Instance.removeBind(this._heartsendcdkey);
                    common.TimerMgr.Instance.removeBind(this._heartreceivecdkey);
                    break;
                case SocketEvent.___SOCKET_CONNECT:
                    if (!this._heart || this._sesond <= 0)
                        return;
                    this.resetCD4Heart();
                    break;
                case SocketEvent.___SOCKET_DATA:
                    let $data: { head: any, body: SByteArray, cell: BaseSocketPak<any> } = $e.Data as { head: any, body: SByteArray, cell: BaseSocketPak<any> };
                    SocketMgr.Instance.put($data.cell);
                    //通知系统分发消息
                    this._distribute.distribute($data.head, $data.body);
                    //无论什么情况，只要有数据过来，表示Socket是联通状态，重置一下心跳计时器，优化心跳的发送频率（减少发送的次数）
                    if (this._heart && this._sesond > 0) {
                        this.resetCD4Heart();
                    }
                    break;
            }
        }

        /**
         * 重新倒计时心跳
         */
        private resetCD4Heart(): void {
            common.TimerMgr.Instance.removeBind(this._heartsendcdkey);
            common.TimerMgr.Instance.removeBind(this._heartreceivecdkey);
            common.TimerMgr.Instance.bindCD(
                this._heartsendcdkey,
                this._sesond,
                this.onTimerCD,
                false,
                1,
                true
            );
        }

        private onTimerCD: ($key: string, $cd: number) => void = ($key: string, $cd: number): void => {
            switch ($key) {
                case this._heartsendcdkey:
                    if (SocketMgr.Instance.send(this._heart.head, this._heart.body)) {
                        common.TimerMgr.Instance.bindCD(
                            this._heartreceivecdkey,
                            this._receive,
                            this.onTimerCD,
                            false,
                            1,
                            true
                        );
                    }
                    break;
                case this._heartreceivecdkey:
                    SocketMgr.Instance.close();
                    break;
            }
        };

        /**
         * 初始化消息处理
         * @param $distribute 消息分发方案
         * @param $heart 心跳包
         * @param $sesond 间隔发送心跳包的时间S
         * @param $receive 收心跳包的时间S
         */
        public init<HEAD extends ISocketHead, BODY>($distribute: ISocketDistribute<HEAD>, $heart: { head: HEAD, body: BODY }, $sesond: number = 60, $receive: number = 12): void {
            this._distribute = new $distribute(SocketMgr.Instance.BodyAnalysis, SocketMgr.Instance.Config);
            if (!$heart || $sesond < 0 || $receive < 0) {
                return;
            }
            this._heart = $heart;
            this._sesond = $sesond;
            this._receive = $receive;
        }
    }
}
