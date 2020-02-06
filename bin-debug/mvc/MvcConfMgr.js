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
         * Mvc配置信息管理器
         * @author Aonaufly
         */
        var MvcConfMgr = (function (_super) {
            __extends(MvcConfMgr, _super);
            function MvcConfMgr() {
                return _super.call(this) || this;
            }
            Object.defineProperty(MvcConfMgr, "Instance", {
                /**
                 * 获取单例对象句柄
                 */
                get: function () {
                    if (!MvcConfMgr._instance)
                        MvcConfMgr._instance = new MvcConfMgr();
                    return MvcConfMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 初始化配置信息
             * @param $data
             */
            MvcConfMgr.prototype.init2XMLRoot = function ($data) {
                if (!$data || $data.trim().length == 0) {
                    console.error("mvc conf is null");
                    return;
                }
                this._root = egret.XML.parse($data.trim());
            };
            Object.defineProperty(MvcConfMgr.prototype, "RootChildren", {
                get: function () {
                    return this._root.children;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取模块配置
             * @param $key 模块id或者maincode
             */
            MvcConfMgr.prototype.getModulesConf = function ($key) {
                var $children = this.RootChildren;
                var $$$errorFun = function () {
                    console.warn("module key: " + $key + " no configed!!!");
                };
                if (!$children || $children.length == 0) {
                    $$$errorFun();
                    return null;
                }
                var $cell;
                var $isString = (typeof $key == "string");
                for (var $i = 0, $j = $children.length; $i < $j; $i++) {
                    $cell = $children[$i];
                    if ($cell.name == "controller") {
                        if ($isString) {
                            if ($cell["$id"] == $key)
                                return $cell;
                        }
                        else {
                            if (parseInt($cell["$maincode"]) == $key) {
                                return $cell;
                            }
                        }
                    }
                }
                $$$errorFun();
                return null;
            };
            /**
             * 获取模块中的View配置
             * @param $moduleConf 模块配置
             */
            MvcConfMgr.prototype.getViewConf = function ($moduleConf) {
                var $children = $moduleConf.children;
                var $$$errorFun = function () {
                    console.warn("module key: " + $moduleConf["$id"] + " view no configed!");
                };
                if (!$children || $children.length == 0) {
                    $$$errorFun();
                    return null;
                }
                var $cell;
                for (var $i = 0, $j = $children.length; $i < $j; $i++) {
                    $cell = $children[$i];
                    if ($cell.name == "view") {
                        return $cell;
                    }
                }
                $$$errorFun();
                return null;
            };
            return MvcConfMgr;
        }(lib2egret.common.BaseSingle));
        mvc.MvcConfMgr = MvcConfMgr;
        __reflect(MvcConfMgr.prototype, "lib2egret.mvc.MvcConfMgr");
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
