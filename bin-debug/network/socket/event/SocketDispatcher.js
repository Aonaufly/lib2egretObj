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
         * Socket基本信息主题
         * @author Aonaufly
         */
        var SocketDispatcher = (function (_super) {
            __extends(SocketDispatcher, _super);
            function SocketDispatcher() {
                return _super.call(this) || this;
            }
            Object.defineProperty(SocketDispatcher, "Instance", {
                /**
                 * 获取单例对象句柄
                 */
                get: function () {
                    if (!SocketDispatcher._instance)
                        SocketDispatcher._instance = new SocketDispatcher();
                    return SocketDispatcher._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @ignore
             */
            SocketDispatcher.prototype.send = function ($type, $data) {
                if (!this.hasEventListener($type)) {
                    var $event = new network.SocketEvent($type, $data);
                    this.dispatchEvent($event);
                }
            };
            return SocketDispatcher;
        }(egret.EventDispatcher));
        network.SocketDispatcher = SocketDispatcher;
        __reflect(SocketDispatcher.prototype, "lib2egret.network.SocketDispatcher");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
