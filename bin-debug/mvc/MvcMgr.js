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
         * Mvc管理器
         * @author Aonaufly
         */
        var MvcMgr = (function (_super) {
            __extends(MvcMgr, _super);
            function MvcMgr() {
                var _this = _super.call(this) || this;
                _this._list2Controllers = new lib2egret.common.HashMap();
                _this._pool2Notifications = new lib2egret.common.Pool2Obj(5);
                _this._moduleResLoaded = new lib2egret.common.HashMap();
                return _this;
            }
            Object.defineProperty(MvcMgr, "Instance", {
                /**
                 * 获取单例对象句柄
                 */
                get: function () {
                    if (!MvcMgr._instance)
                        MvcMgr._instance = new MvcMgr();
                    return MvcMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 打开模块
             * @param $moduleKey 模块id或者引用对象
             * @param $data 开启数据
             * @param $router 路由数据
             */
            MvcMgr.prototype.openController = function ($moduleKey, $data, $router) {
                var $controller = this.getController($moduleKey);
                $controller.open($data, $router);
            };
            MvcMgr.prototype.getDefinition = function ($moduleKey) {
                if (typeof $moduleKey == "string" || typeof $moduleKey == "number") {
                    var $conf = mvc.MvcConfMgr.Instance.getModulesConf($moduleKey);
                    return egret.getDefinitionByName($conf["$name"].trim());
                }
                else
                    return $moduleKey;
            };
            /**
             * 关闭模块
             * @param $moduleKey 模块id/maincode或者引用对象
             * @param $isDestroy 是否销毁
             */
            MvcMgr.prototype.closeController = function ($moduleKey, $isDestroy) {
                var _this = this;
                if ($isDestroy === void 0) { $isDestroy = false; }
                return new Promise(function (resolve, reject) {
                    var $definition = _this.getDefinition($moduleKey);
                    if (_this.hasController($definition)) {
                        var $controller = _this.getController($definition, null);
                        $controller.close($isDestroy).then(function ($destory) {
                            if ($destory)
                                _this._list2Controllers.remove($definition);
                        }).catch(function (e) { return console.log(e); });
                    }
                    resolve();
                });
            };
            /**
             * 获取模块中的主题
             * @param $moduleKey 模块id/maincode或者引用对象
             */
            MvcMgr.prototype.getNotification4Controller = function ($moduleKey) {
                var $definition = this.getDefinition($moduleKey);
                if (this.hasController($definition)) {
                    var $controller = this.getController($definition, null);
                    return $controller.getNotification();
                }
                return null;
            };
            /**
             * 获取主题
             */
            MvcMgr.prototype.getNotification = function () {
                var $cell = this._pool2Notifications.Cell;
                if ($cell)
                    return $cell;
                $cell = new mvc.NotificationDispatcher();
                return $cell;
            };
            /**
             * 将主题放入池子
             * @param $cell 主题
             */
            MvcMgr.prototype.putNotification = function ($cell) {
                this._pool2Notifications.put($cell);
            };
            /**
             * 获取模块中的model代理类
             * @param $moduleKey 模块id/maincode或者引用对象
             */
            MvcMgr.prototype.getProxy4Controller = function ($moduleKey) {
                var $definition = this.getDefinition($moduleKey);
                if (this.hasController($definition)) {
                    var $controller = this.getController($definition, null);
                    return $controller.getProxy();
                }
                return null;
            };
            /**
             * 获取一个controller类
             * @param $moduleKey 模块id/maincode或者引用对象
             * @param $notification 主题
             */
            MvcMgr.prototype.getController = function ($moduleKey, $notification) {
                var $definition = this.getDefinition($moduleKey);
                if (this.hasController($definition))
                    return this._list2Controllers.getValue($definition);
                return this.createController($definition, $notification);
            };
            MvcMgr.prototype.createController = function ($definition, $notification) {
                var $controller = new $definition($notification);
                this._list2Controllers.add($definition, $controller);
                return $controller;
            };
            /**
             * 是否存在此模块
             * @param $moduleKey $notification
             */
            MvcMgr.prototype.hasController = function ($moduleKey) {
                return this._list2Controllers.containsKey($moduleKey);
            };
            /**
             * 获取模块中的View
             * @param $moduleKey 模块id/maincode或者引用对象
             */
            MvcMgr.prototype.getView = function ($moduleKey) {
                var $definition = this.getDefinition($moduleKey);
                if (this.hasController($definition)) {
                    var $controller = this.getController($definition, null);
                    return $controller.getView();
                }
                return null;
            };
            /**
             * @ignore
             */
            MvcMgr.prototype.setModuleRes = function ($moduleKey, $loaded) {
                var $definition = this.getDefinition($moduleKey);
                if (this._moduleResLoaded.containsKey($definition)) {
                    if (!$loaded) {
                        this._moduleResLoaded.remove($definition);
                    }
                    else {
                        this._moduleResLoaded.add($definition, $loaded, true);
                    }
                }
                else {
                    if ($loaded) {
                        this._moduleResLoaded.add($definition, $loaded);
                    }
                }
            };
            /**
             * @ignore
             */
            MvcMgr.prototype.getModuleRes = function ($moduleKey) {
                var $definition = this.getDefinition($moduleKey);
                if (this._moduleResLoaded.containsKey($definition)) {
                    return this._moduleResLoaded.getValue($definition);
                }
                return false;
            };
            return MvcMgr;
        }(lib2egret.common.BaseSingle));
        mvc.MvcMgr = MvcMgr;
        __reflect(MvcMgr.prototype, "lib2egret.mvc.MvcMgr");
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
