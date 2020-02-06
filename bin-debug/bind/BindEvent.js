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
    var bind;
    (function (bind) {
        /**
         * @ignore
         */
        var BindEvent = (function (_super) {
            __extends(BindEvent, _super);
            function BindEvent($type, $data) {
                return _super.call(this, $type, true, true, $data) || this;
            }
            BindEvent.getCMD = function ($attribute) {
                return BindEvent.BIND_CMD + "_2_" + $attribute;
            };
            Object.defineProperty(BindEvent.prototype, "Data", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            BindEvent.BIND_CMD = "BIND_CMD";
            return BindEvent;
        }(egret.Event));
        bind.BindEvent = BindEvent;
        __reflect(BindEvent.prototype, "lib2egret.bind.BindEvent");
    })(bind = lib2egret.bind || (lib2egret.bind = {}));
})(lib2egret || (lib2egret = {}));
