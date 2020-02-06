var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var mvc;
    (function (mvc) {
        /**
         * View打开关闭特效基类
         * @author Aonaufly
         */
        var BaseUIEffect = (function () {
            function BaseUIEffect($main, $mask) {
                this._main = $main;
                this._mask = $mask;
                this._initMainLo = {
                    x: this._main.x,
                    y: this._main.y
                };
                this._initMaskAlpha = this._mask.alpha;
            }
            return BaseUIEffect;
        }());
        mvc.BaseUIEffect = BaseUIEffect;
        __reflect(BaseUIEffect.prototype, "lib2egret.mvc.BaseUIEffect", ["lib2egret.common.IDestroy"]);
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
