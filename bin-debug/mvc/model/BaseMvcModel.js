var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var mvc;
    (function (mvc) {
        /**
         * 数据模型
         * @author Aonaufly
         */
        var BaseMvcModel = (function () {
            function BaseMvcModel() {
            }
            /**
             * @inheritDoc
             */
            BaseMvcModel.prototype.destroy = function ($callback, $params) {
                if (this._data) {
                    this._data = null;
                }
            };
            return BaseMvcModel;
        }());
        mvc.BaseMvcModel = BaseMvcModel;
        __reflect(BaseMvcModel.prototype, "lib2egret.mvc.BaseMvcModel", ["lib2egret.common.IDestroy"]);
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
