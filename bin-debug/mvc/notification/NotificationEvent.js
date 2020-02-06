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
         * MVC 模块通讯事件
         * @author Aonaufly
         */
        var NotificationEvent = (function (_super) {
            __extends(NotificationEvent, _super);
            /**
             * @ignore
             */
            function NotificationEvent($type, $data) {
                var _this = _super.call(this, $type) || this;
                _this._data = $data;
                return _this;
            }
            Object.defineProperty(NotificationEvent.prototype, "Data", {
                /**
                 * 获取数据
                 */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            return NotificationEvent;
        }(egret.Event));
        mvc.NotificationEvent = NotificationEvent;
        __reflect(NotificationEvent.prototype, "lib2egret.mvc.NotificationEvent");
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
