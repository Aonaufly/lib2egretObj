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
         * Socket消息处理
         * @author Aoanufly
         */
        var SocketMsgMgr = (function (_super) {
            __extends(SocketMsgMgr, _super);
            function SocketMsgMgr() {
                var _this = _super.call(this) || this;
                _this._heartsendcdkey = "_heartsendcdkey";
                _this._heartreceivecdkey = "_heartreceivecdkey";
                _this.onTimerCD = function ($key, $cd) {
                    switch ($key) {
                        case _this._heartsendcdkey:
                            if (network.SocketMgr.Instance.send(_this._heart.head, _this._heart.body)) {
                                lib2egret.common.TimerMgr.Instance.bindCD(_this._heartreceivecdkey, _this._receive, _this.onTimerCD, false, 1, true);
                            }
                            break;
                        case _this._heartreceivecdkey:
                            network.SocketMgr.Instance.close();
                            break;
                    }
                };
                network.SocketDispatcher.Instance.addEventListener(network.SocketEvent.___SOCKET_CLOSE, _this.onSocketEvent, _this);
                network.SocketDispatcher.Instance.addEventListener(network.SocketEvent.___SOCKET_DATA, _this.onSocketEvent, _this);
                network.SocketDispatcher.Instance.addEventListener(network.SocketEvent.___SOCKET_CONNECT, _this.onSocketEvent, _this);
                return _this;
            }
            Object.defineProperty(SocketMsgMgr, "Instance", {
                get: function () {
                    if (!SocketMsgMgr._instance)
                        SocketMsgMgr._instance = new SocketMsgMgr();
                    return SocketMsgMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            SocketMsgMgr.prototype.onSocketEvent = function ($e) {
                switch ($e.type) {
                    case network.SocketEvent.___SOCKET_CLOSE:
                        if (!this._heart || this._sesond < 0)
                            return;
                        lib2egret.common.TimerMgr.Instance.removeBind(this._heartsendcdkey);
                        break;
                    case network.SocketEvent.___SOCKET_CONNECT:
                        if (!this._heart || this._sesond < 0)
                            return;
                        lib2egret.common.TimerMgr.Instance.bindCD(this._heartsendcdkey, this._sesond, this.onTimerCD, false, 1, true);
                        break;
                    case network.SocketEvent.___SOCKET_DATA:
                        var $data = $e.Data;
                        network.SocketMgr.Instance.put($data.cell);
                        if (this._distribute.distribute($data.head, $data.body) && this._heart && this._sesond > 0) {
                            lib2egret.common.TimerMgr.Instance.removeBind(this._heartreceivecdkey);
                            lib2egret.common.TimerMgr.Instance.bindCD(this._heartsendcdkey, this._sesond, this.onTimerCD, false, 1, true);
                        }
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
            SocketMsgMgr.prototype.init = function ($distribute, $heart, $sesond, $receive) {
                if ($sesond === void 0) { $sesond = 60; }
                if ($receive === void 0) { $receive = 12; }
                this._distribute = new $distribute();
                if (!$heart || $sesond < 0 || $receive < 0) {
                    return;
                }
                this._heart = $heart;
                this._sesond = $sesond;
                this._receive = $receive;
            };
            return SocketMsgMgr;
        }(lib2egret.common.BaseSingle));
        network.SocketMsgMgr = SocketMsgMgr;
        __reflect(SocketMsgMgr.prototype, "lib2egret.network.SocketMsgMgr");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
