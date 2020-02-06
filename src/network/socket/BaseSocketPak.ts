module lib2egret.network {
    /**
     * Socket数据包基类
     * @author Aonaufly
     */
    export abstract class BaseSocketPak<HEAD extends ISocketHead, BODY> implements common.IDestroy {
        private _byte: SByteArray;
        protected _bodyLen: number;
        protected _crypto: ICrypto;
        protected _head: HEAD;
        protected _body: BODY;
        /**头部长度*/
        protected abstract get HeadLen(): number;

        public constructor($byte: SByteArray, $crypto: ICrypto) {
            this._byte = $byte;
            this._crypto = $crypto;
        }

        /**
         * 重置Byte
         * @param $byte 二进制收据
         */
        public resetByte($byte: SByteArray): void {
            this._bodyLen = null;
            this._head = null;
            this._body = null;
            this._byte = $byte;
        }

        /**
         * 检测是否完成本包接收
         * @return over：是否完成 ， $surplus： 是否有多余的二进制数据
         * @ignore
         */
        public check2Receive(): { over: boolean, $surplus?: SByteArray } {
            if (!this.OverHead) {
                this._byte.position = 0;
                this.analysisHead();
            }
            if (this.OverHead) {
                this._byte.position = this._bodyLen;
                const $surplusLen: number = this._byte.bytesAvailable;
                if ($surplusLen >= this._bodyLen) {
                    this.analysisBody();
                    SocketDispatcher.Instance.send<{ head: HEAD, body: BODY, cell: BaseSocketPak<HEAD, BODY> }>(SocketEvent.___SOCKET_DATA, { head: this._head, body: this._body, cell: this });
                    if ($surplusLen > this._bodyLen) {
                        let $surplusCell: SByteArray = SocketMgr.Instance.getSBy();
                        $surplusCell.writeBytes(this._byte, this._byte.position);
                        return { over: true, $surplus: $surplusCell };
                    } else {
                        return { over: true };
                    }
                }
            }
            return null;
        }

        /**
         * 解析头部数据（接收数据）
         */
        protected abstract analysisHead(): void;

        /**
         * 处理头部数据（数据发送）
         * @param $head 头部数据
         */
        protected abstract unanalysisHead($head: HEAD): SByteArray;

        /**
         * 获得发送的数据
         * @param $head
         * @param $body
         */
        public getSendData($head: HEAD, $body: BODY): SByteArray {
            let $bodyBy: SByteArray = this.unanalysisBody($body);
            let $len: number = $bodyBy.length;
            $head._bodyLen = $len;
            let $headBy: SByteArray = this.unanalysisHead($head);
            $headBy.position = $headBy.length;
            $headBy.writeBytes($bodyBy, 0, $bodyBy.length);
            SocketMgr.Instance.put($bodyBy);
            return $headBy;
        }

        /**
         * 解析包体数据（数据接收）
         */
        protected abstract analysisBody(): void;

        /**
         * 处理胞体数据（数据发送）
         * @param $body 包体数据
         */
        protected abstract unanalysisBody($body: BODY): SByteArray;

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this._byte = null;
            this._crypto = null;
            $callback && $callback($params);
        }

        public get OverHead(): boolean {
            return this._head != null;
        }

        public get Bytes(): SByteArray {
            if (this._byte.position != this._byte.length) {
                this._byte.position = this._byte.length;
            }
            return this._byte;
        }
    }

    export interface ISocketPak<HEAD extends ISocketHead, BODY> {
        new($byte: SByteArray, $crypto: ICrypto): BaseSocketPak<HEAD, BODY>;
    }
}
