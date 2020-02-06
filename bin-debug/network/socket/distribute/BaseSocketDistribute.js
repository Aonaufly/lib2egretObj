var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var network;
    (function (network) {
        /**
         * Socket系统分发
         * @author Aonaufly
         */
        var BaseSocketDistribute = (function () {
            function BaseSocketDistribute() {
            }
            return BaseSocketDistribute;
        }());
        network.BaseSocketDistribute = BaseSocketDistribute;
        __reflect(BaseSocketDistribute.prototype, "lib2egret.network.BaseSocketDistribute");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
