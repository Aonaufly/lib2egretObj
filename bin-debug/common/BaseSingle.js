var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var common;
    (function (common) {
        /**
         * 单例基类
         * @author Aonaufly
         */
        var BaseSingle = (function () {
            function BaseSingle() {
                if (BaseSingle._instance) {
                    egret.error(egret.getQualifiedClassName(this) + " is instance , Please use Instance to get instance object\uFF01");
                }
            }
            BaseSingle._instance = null;
            return BaseSingle;
        }());
        common.BaseSingle = BaseSingle;
        __reflect(BaseSingle.prototype, "lib2egret.common.BaseSingle");
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
