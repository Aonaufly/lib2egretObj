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
         * Mvc路由
         * @author Aonaufly
         */
        var MvcRouterMgr = (function (_super) {
            __extends(MvcRouterMgr, _super);
            function MvcRouterMgr() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(MvcRouterMgr, "Instance", {
                get: function () {
                    if (!MvcRouterMgr._instance)
                        MvcRouterMgr._instance = new MvcRouterMgr();
                    return MvcRouterMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 开启路由
             * @param $router 路由信息
             */
            MvcRouterMgr.prototype.openRouter = function ($router) {
                var $routerObj = this.analysisRouter($router);
                if ($routerObj) {
                    mvc.MvcMgr.Instance.openController($routerObj.module, null, $routerObj);
                }
            };
            /**
             * 路由数据解析
             * @param $router
             */
            MvcRouterMgr.prototype.analysisRouter = function ($router) {
                if (!$router || $router.trim().length == 0 || $router.trim().indexOf(":") < 0) {
                    console.error("router " + $router + " is null or error!");
                    return null;
                }
                var $arr = $router.trim().split(":");
                var $type;
                if ($arr[1].indexOf("-") > 0) {
                    var $strArr = $arr[1].trim().split("-");
                    $type = [];
                    $strArr.forEach(function ($item) {
                        $type.push($item.trim());
                    });
                }
                else {
                    $type = $arr[1].trim();
                }
                var $data = $arr.length < 3 ? null : JSON.parse($arr[2]);
                return {
                    module: $arr[0].trim(),
                    type: $type,
                    data: $data
                };
            };
            return MvcRouterMgr;
        }(lib2egret.common.BaseSingle));
        mvc.MvcRouterMgr = MvcRouterMgr;
        __reflect(MvcRouterMgr.prototype, "lib2egret.mvc.MvcRouterMgr");
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
