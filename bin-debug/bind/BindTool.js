var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var lib2egret;
(function (lib2egret) {
    var bind;
    (function (bind) {
        /**
         * 绑定工具
         * @author Aonaufly
         */
        var BindTool = (function () {
            function BindTool() {
            }
            /**
             * 绑定属性（字段）
             * @param $subClass 监听类
             * @param $subField 监听类属性（字段）
             * @param $modClass model类
             * @param $modAttribute model类属性名称
             * @param $isInit 是否初始化数据
             */
            BindTool.bind2Field = function ($subClass, $subField, $modClass, $modAttribute, $isInit) {
                if ($isInit === void 0) { $isInit = true; }
                var $sub = new bind.Bind2Subscriber();
                $sub.bind4Field($subClass, $subField, $modClass, $modAttribute, $isInit);
                return $sub;
            };
            /**
             * 绑定回调
             * @param $callback 回调函数
             * @param $modClass model类
             * @param $modAttribute model类属性名称
             * @param $isInit 是否初始化数据
             */
            BindTool.bind2Callback = function ($callback, $modClass, $modAttribute, $isInit) {
                if ($isInit === void 0) { $isInit = true; }
                var $sub = new bind.Bind2Subscriber();
                $sub.bind2Callback($callback, $modClass, $modAttribute, $isInit);
                return $sub;
            };
            return BindTool;
        }());
        bind.BindTool = BindTool;
        __reflect(BindTool.prototype, "lib2egret.bind.BindTool");
        /**
         * Model绑定属性
         * @param $field_name 字段名称
         * @param $modelFirst model优先
         */
        function set2Bind($field_name, $modelFirst) {
            if ($modelFirst === void 0) { $modelFirst = true; }
            return function (target, propertyKey, descriptor) {
                return __assign({}, descriptor, { set: function ($value) {
                        if (typeof this.changedValue != "undefined") {
                            this.changedValue($field_name, propertyKey, $value, $modelFirst);
                        }
                        else {
                            console.error(egret.getQualifiedClassName(this) + " need to extends parent class BindBaseModel!");
                        }
                    } });
            };
        }
        bind.set2Bind = set2Bind;
    })(bind = lib2egret.bind || (lib2egret.bind = {}));
})(lib2egret || (lib2egret = {}));
