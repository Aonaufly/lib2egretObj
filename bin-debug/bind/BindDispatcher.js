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
        var BindDispatcher = (function (_super) {
            __extends(BindDispatcher, _super);
            function BindDispatcher() {
                return _super.call(this) || this;
            }
            Object.defineProperty(BindDispatcher, "Instance", {
                get: function () {
                    if (!BindDispatcher._instance)
                        BindDispatcher._instance = new BindDispatcher();
                    return BindDispatcher._instance;
                },
                enumerable: true,
                configurable: true
            });
            BindDispatcher.prototype.send = function ($attribute, $old, $new, $modelClass, $modelFirst) {
                var $cmd = bind.BindEvent.getCMD($attribute);
                if (this.hasEventListener($cmd)) {
                    var $event = new bind.BindEvent($cmd, {
                        $old: $old,
                        $new: $new,
                        $attribute: $attribute,
                        $modelFirst: $modelFirst,
                        $modelClass: $modelClass
                    });
                    this.dispatchEvent($event);
                }
            };
            return BindDispatcher;
        }(egret.EventDispatcher));
        bind.BindDispatcher = BindDispatcher;
        __reflect(BindDispatcher.prototype, "lib2egret.bind.BindDispatcher");
    })(bind = lib2egret.bind || (lib2egret.bind = {}));
})(lib2egret || (lib2egret = {}));
