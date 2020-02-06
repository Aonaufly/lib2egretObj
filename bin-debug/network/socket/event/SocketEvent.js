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
         * Socket基础数据Event
         * T : 默认{head: HEAD, body: BODY , cell: BaseSocketPak<HEAD,BODY>}
         * @author Aoanufly
         */
        var SocketEvent = (function (_super) {
            __extends(SocketEvent, _super);
            function SocketEvent($type, $data) {
                return _super.call(this, $type, true, true, $data) || this;
            }
            Object.defineProperty(SocketEvent.prototype, "Data", {
                /**
                 * 获取数据
                 */
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            /**Socket 连接完成*/
            SocketEvent.___SOCKET_CONNECT = "socket_connect";
            /**Socket 已关闭*/
            SocketEvent.___SOCKET_CLOSE = "socket_close";
            /**Socket 连接出错*/
            SocketEvent.___SOCKET_ERROR = "socket_error";
            /**socket 返回数据*/
            SocketEvent.___SOCKET_DATA = "socket_data";
            return SocketEvent;
        }(egret.Event));
        network.SocketEvent = SocketEvent;
        __reflect(SocketEvent.prototype, "lib2egret.network.SocketEvent");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
