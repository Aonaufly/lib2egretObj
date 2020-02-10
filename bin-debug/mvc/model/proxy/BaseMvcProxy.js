var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var mvc;
    (function (mvc) {
        /**
         * model代理基类
         * @author Aonaufly
         */
        var BaseMvcProxy = (function () {
            function BaseMvcProxy($callback) {
                this._models = new lib2egret.common.HashMap();
                this._callback = $callback;
            }
            /**
             * 获取模型
             * @param $modelKey 模型Key
             */
            BaseMvcProxy.prototype.getModel = function ($modelKey) {
                if (this._models) {
                    return this._models.getValue($modelKey);
                }
                return null;
            };
            /**
             * @inheritDoc
             */
            BaseMvcProxy.prototype.destroy = function ($callback, $params) {
                if (this._models) {
                    this._models.destroy();
                    this._models = null;
                }
                if (this._callback)
                    this._callback = null;
                $callback && $callback($params);
            };
            return BaseMvcProxy;
        }());
        mvc.BaseMvcProxy = BaseMvcProxy;
        __reflect(BaseMvcProxy.prototype, "lib2egret.mvc.BaseMvcProxy", ["lib2egret.common.IDestroy"]);
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
