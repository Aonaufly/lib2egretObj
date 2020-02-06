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
    var mvc;
    (function (mvc) {
        /**
         * MVC模块通信主题
         * @author Aonaufly
         */
        var NotificationDispatcher = (function (_super) {
            __extends(NotificationDispatcher, _super);
            function NotificationDispatcher() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * 发送信息
             * @param $type 信息类型
             * @param $data 信息数据
             */
            NotificationDispatcher.prototype.send = function ($type, $data) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (_this.hasEventListener($type)) {
                        var $event = new mvc.NotificationEvent($type, $data);
                        _this.dispatchEvent($event);
                    }
                    resolve(_this.hasEventListener($type));
                });
            };
            return NotificationDispatcher;
        }(egret.EventDispatcher));
        mvc.NotificationDispatcher = NotificationDispatcher;
        __reflect(NotificationDispatcher.prototype, "lib2egret.mvc.NotificationDispatcher");
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
