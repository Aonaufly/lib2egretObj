var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var network;
    (function (network) {
        /**
         * Socket数据包基类
         * @author Aonaufly
         */
        var BaseSocketPak = (function () {
            function BaseSocketPak($byte, $crypto) {
                this._byte = $byte;
                this._crypto = $crypto;
            }
            /**
             * 重置Byte
             * @param $byte 二进制收据
             */
            BaseSocketPak.prototype.resetByte = function ($byte) {
                this._bodyLen = null;
                this._head = null;
                this._body = null;
                this._byte = $byte;
            };
            /**
             * 检测是否完成本包接收
             * @return over：是否完成 ， $surplus： 是否有多余的二进制数据
             * @ignore
             */
            BaseSocketPak.prototype.check2Receive = function () {
                if (!this.OverHead) {
                    this._byte.position = 0;
                    this.analysisHead();
                }
                if (this.OverHead) {
                    this._byte.position = this._bodyLen;
                    var $surplusLen = this._byte.bytesAvailable;
                    if ($surplusLen >= this._bodyLen) {
                        this.analysisBody();
                        network.SocketDispatcher.Instance.send(network.SocketEvent.___SOCKET_DATA, { head: this._head, body: this._body, cell: this });
                        if ($surplusLen > this._bodyLen) {
                            var $surplusCell = network.SocketMgr.Instance.getSBy();
                            $surplusCell.writeBytes(this._byte, this._byte.position);
                            return { over: true, $surplus: $surplusCell };
                        }
                        else {
                            return { over: true };
                        }
                    }
                }
                return null;
            };
            /**
             * 获得发送的数据
             * @param $head
             * @param $body
             */
            BaseSocketPak.prototype.getSendData = function ($head, $body) {
                var $bodyBy = this.unanalysisBody($body);
                var $len = $bodyBy.length;
                $head._bodyLen = $len;
                var $headBy = this.unanalysisHead($head);
                $headBy.position = $headBy.length;
                $headBy.writeBytes($bodyBy, 0, $bodyBy.length);
                network.SocketMgr.Instance.put($bodyBy);
                return $headBy;
            };
            /**
             * @inheritDoc
             */
            BaseSocketPak.prototype.destroy = function ($callback, $params) {
                this._byte = null;
                this._crypto = null;
                $callback && $callback($params);
            };
            Object.defineProperty(BaseSocketPak.prototype, "OverHead", {
                /**
                 * 包头是否解析完毕
                 */
                get: function () {
                    return this._head != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSocketPak.prototype, "Bytes", {
                /**
                 * 获取二进制数据
                 */
                get: function () {
                    if (this._byte.position != this._byte.length) {
                        this._byte.position = this._byte.length;
                    }
                    return this._byte;
                },
                enumerable: true,
                configurable: true
            });
            return BaseSocketPak;
        }());
        network.BaseSocketPak = BaseSocketPak;
        __reflect(BaseSocketPak.prototype, "lib2egret.network.BaseSocketPak", ["lib2egret.common.IDestroy"]);
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
