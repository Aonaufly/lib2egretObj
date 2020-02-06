var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var bind;
    (function (bind) {
        /**
         * model绑定基类
         * @author Aonaufly
         */
        var BindBaseModel = (function () {
            function BindBaseModel() {
            }
            /**
             *@ignore
             */
            BindBaseModel.prototype.changedValue = function ($field, $attribute, $value, $modelFirst) {
                if ($modelFirst === void 0) { $modelFirst = true; }
                if (this[$field] != $value) {
                    var $old = this[$field];
                    if ($modelFirst) {
                        this[$field] = $value;
                    }
                    bind.BindDispatcher.Instance.send($attribute, $old, $value, this, $modelFirst);
                    if (!$modelFirst) {
                        this[$field] = $value;
                    }
                }
            };
            return BindBaseModel;
        }());
        bind.BindBaseModel = BindBaseModel;
        __reflect(BindBaseModel.prototype, "lib2egret.bind.BindBaseModel");
    })(bind = lib2egret.bind || (lib2egret.bind = {}));
})(lib2egret || (lib2egret = {}));
