var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var lib2egret;
(function (lib2egret) {
    var network;
    (function (network) {
        /**
         * Socket管理器
         * @author Aoanufly
         */
        var SocketMgr = (function (_super) {
            __extends(SocketMgr, _super);
            function SocketMgr() {
                var _this = _super.call(this) || this;
                _this._endian = egret.Endian.LITTLE_ENDIAN;
                _this.handlerData = function () {
                    if (!_this._curPak)
                        return;
                    var $data = _this._curPak.check2Receive();
                    if (!$data)
                        return;
                    if ($data.over) {
                        if (!$data.$surplus) {
                            _this._curPak = null;
                        }
                        else {
                            $data.$surplus.position = $data.$surplus.length;
                            _this._curPak = _this.getPak($data.$surplus);
                            _this.handlerData();
                        }
                    }
                };
                _this._socket = new egret.WebSocket();
                _this._socket.type = egret.WebSocket.TYPE_BINARY;
                _this._pool2Pak = new lib2egret.common.Pool2Obj(4);
                _this._pool2SBy = new lib2egret.common.Pool2Obj(4);
                return _this;
            }
            Object.defineProperty(SocketMgr, "Instance", {
                /**
                 * 获取单例对象句柄
                 */
                get: function () {
                    if (!SocketMgr._instance)
                        SocketMgr._instance = new SocketMgr();
                    return SocketMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            SocketMgr.prototype.listener = function ($isAdd) {
                if ($isAdd) {
                    !this._socket.hasEventListener(egret.ProgressEvent.SOCKET_DATA) && this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
                    !this._socket.hasEventListener(egret.Event.CONNECT) && this._socket.addEventListener(egret.Event.CONNECT, this.onSocketEvent, this);
                    !this._socket.hasEventListener(egret.Event.CLOSE) && this._socket.addEventListener(egret.Event.CLOSE, this.onSocketEvent, this);
                    !this._socket.hasEventListener(egret.IOErrorEvent.IO_ERROR) && this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
                }
                else {
                    this._socket.hasEventListener(egret.ProgressEvent.SOCKET_DATA) && this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
                    this._socket.hasEventListener(egret.Event.CONNECT) && this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketEvent, this);
                    this._socket.hasEventListener(egret.Event.CLOSE) && this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketEvent, this);
                    this._socket.hasEventListener(egret.IOErrorEvent.IO_ERROR) && this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
                }
            };
            SocketMgr.prototype.onReceiveMessage = function ($e) {
                if (!this._curPak) {
                    var $sby = this.getSBy();
                    this._curPak = this.getPak($sby);
                }
                this._socket.readBytes(this._curPak.Bytes);
                this.handlerData();
            };
            SocketMgr.prototype.onSocketEvent = function ($e) {
                switch ($e.type) {
                    case egret.Event.COMPLETE:
                        network.SocketDispatcher.Instance.send(network.SocketEvent.___SOCKET_CONNECT);
                        break;
                    case egret.Event.CLOSE:
                        network.SocketDispatcher.Instance.send(network.SocketEvent.___SOCKET_CLOSE);
                        break;
                }
            };
            SocketMgr.prototype.onSocketError = function ($e) {
                this.listener(false);
                network.SocketDispatcher.Instance.send(network.SocketEvent.___SOCKET_ERROR, $e.data);
            };
            Object.defineProperty(SocketMgr.prototype, "Endian", {
                /**
                 * 获取大小端
                 */
                get: function () {
                    return this._endian;
                },
                /**
                 * 设置大小端
                 * @param $endian 大小端
                 */
                set: function ($endian) {
                    if (this._endian != $endian) {
                        this._endian = $endian;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 发送信息
             * @param $head 包头
             * @param $body 包体
             */
            SocketMgr.prototype.send = function ($head, $body) {
                if (this._socket.connected) {
                    var $data = this.getPak(this.getSBy());
                    $data.getSendData($head, $body);
                    this._socket.writeBytes($data.Bytes, 0, $data.Bytes.bytesAvailable);
                    this._socket.flush();
                    this.put($data);
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * 初始化
             * @param $serviceAdd 服务器地址
             * @param $pak 包
             * @param $crypto 加密
             */
            SocketMgr.prototype.init = function ($serviceAdd, $pak, $crypto) {
                if ($crypto === void 0) { $crypto = null; }
                this._crypto = $crypto;
                this._pak = $pak;
                this._serviceAdd = $serviceAdd;
            };
            SocketMgr.prototype.open = function () {
                this.listener(true);
                if (this._serviceAdd.indexOf("ws") > 0) {
                    this._socket.connectByUrl(this._serviceAdd);
                }
                else {
                    var $arr = this._serviceAdd.split(":");
                    this._socket.connect($arr[0].trim(), parseInt($arr[1]));
                }
            };
            /**
             * 连接服务器
             */
            SocketMgr.prototype.startConnect = function () {
                if (!this._socket.connected) {
                    this.open();
                }
            };
            /**
             * 关闭连接
             */
            SocketMgr.prototype.close = function () {
                if (this._socket.connected) {
                    this.listener(false);
                    this._socket.close();
                }
            };
            /**
             * 获取二进制数据对象
             */
            SocketMgr.prototype.getSBy = function () {
                var $cell = this._pool2SBy.Cell;
                if (!$cell) {
                    $cell = new network.SByteArray();
                }
                else {
                    $cell.reset();
                }
                return $cell;
            };
            /**
             * 获取Socket包
             * @param $sby 二进制对象
             */
            SocketMgr.prototype.getPak = function ($sby) {
                var $cell = this._pool2Pak.Cell;
                if (!$cell) {
                    $cell = new this._pak($sby, this._crypto);
                }
                else {
                    $cell.resetByte($sby);
                }
                return $cell;
            };
            /**
             * 放入对象池
             * @param $cell BaseSocketPak<HEAD,BODY> | SByteArray
             */
            SocketMgr.prototype.put = function ($cell) {
                if ($cell instanceof network.SByteArray) {
                    this._pool2SBy.put($cell);
                }
                else {
                    this._pool2SBy.put($cell.Bytes);
                    if (!this._pool2Pak.put($cell)) {
                        $cell.destroy();
                    }
                }
            };
            return SocketMgr;
        }(lib2egret.common.BaseSingle));
        network.SocketMgr = SocketMgr;
        __reflect(SocketMgr.prototype, "lib2egret.network.SocketMgr");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
