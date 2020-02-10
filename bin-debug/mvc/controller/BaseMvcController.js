var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var mvc;
    (function (mvc) {
        /**
         * controller基类
         * @author Aonaufly
         */
        var BaseMvcController = (function () {
            function BaseMvcController($notification) {
                if ($notification === void 0) { $notification = null; }
                this._destroyRes = false;
                this._closeDestroy = false;
                if ($notification)
                    this._notification = $notification;
                else
                    this._notification = mvc.MvcMgr.Instance.getNotification();
                this.analysis2Conf();
                this.listener2Cmds(true);
            }
            BaseMvcController.prototype.getModuleConf = function () {
                return mvc.MvcConfMgr.Instance.getModulesConf(this._key);
            };
            //解析配置
            BaseMvcController.prototype.analysis2Conf = function () {
                var $conf = this.getModuleConf();
                this._viewConf = mvc.MvcConfMgr.Instance.getViewConf($conf);
                this._maincode = parseInt($conf["$maincode"]);
                var $layoutIndex = parseInt($conf["$layoutIndex"]);
                this._parent = lib2egret.common.GameLayoutMgr.Instance.getLayout($layoutIndex);
                this._closeDestroy = $conf["$closeDestroy"] && +$conf["$closeDestroy"] == 1;
                var $loadRes = mvc.MvcMgr.Instance.getModuleRes(this._key);
                if (!$loadRes && $conf["$loading"] && +$conf["$loading"] == 1) {
                    var $loadingUI = $conf["$loadingName"] && $conf["$loadingName"].trim().length > 0 ?
                        $conf["$loadingName"].trim() : null;
                    this.loadModuleRespacket($loadingUI);
                }
                else {
                    this._view = BaseMvcController.creatView(this._viewConf["$name"], this._parent, this._viewConf, this.callback2View);
                    this._viewConf = null;
                }
                this._destroyRes = $conf["$destroyRes"] && +$conf["$destroyRes"] == 1;
                var $pClass = egret.getDefinitionByName($conf["$proxyName"]);
                this._proxy = new $pClass(this.callback2Proxy);
            };
            BaseMvcController.prototype.loadModuleRespacket = function ($loadingui) {
                if ($loadingui) {
                    this.loadingHandler(true, $loadingui);
                }
                this.lisener2Res(true);
                RES.loadGroup(this._key);
            };
            BaseMvcController.prototype.lisener2Res = function ($isAdd) {
                if ($isAdd) {
                    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResHandler, this);
                    this._loadui && RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResHandler, this);
                    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResHandler, this);
                }
                else {
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResHandler, this);
                    this._loadui && RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResHandler, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResHandler, this);
                }
            };
            /**
             * 处理LoadingUI
             * @param $isShow 是否显示loading界面
             * @param $loadingui loadingUI的引用对象
             */
            BaseMvcController.prototype.loadingHandler = function ($isShow, $loadingui) {
                if ($isShow) {
                    if (!this._loadui) {
                        var $lClass = egret.getDefinitionByName($loadingui);
                        this._loadui = new $lClass();
                        this._parent.addChild(this._loadui);
                    }
                }
                else {
                    if (this._loadui) {
                        lib2egret.common.CommonTool.remove4Parent(this._loadui);
                        this._loadui.destroy();
                        this._loadui = null;
                    }
                }
            };
            BaseMvcController.prototype.onResHandler = function ($e) {
                if ($e.groupName != this._key)
                    return;
                switch ($e.type) {
                    case RES.ResourceEvent.GROUP_COMPLETE:
                        this.lisener2Res(false);
                        this.loadingHandler(false);
                        //初始化view
                        this._view = BaseMvcController.creatView(this._viewConf["$name"], this._parent, this._viewConf, this.callback2View);
                        this._viewConf = null;
                        break;
                    case RES.ResourceEvent.GROUP_PROGRESS:
                        this._loadui.update($e.itemsTotal, $e.itemsLoaded);
                        break;
                    case RES.ResourceEvent.GROUP_LOAD_ERROR:
                        console.error("module " + this._key + " res group no find!");
                        break;
                }
            };
            BaseMvcController.prototype.listener2Cmds = function ($isAdd) {
                var _this = this;
                if (this.cmds != null) {
                    var $arr = this.cmds;
                    $arr.forEach(function ($item) {
                        if ($isAdd) {
                            if (!_this._notification.hasEventListener($item)) {
                                _this._notification.addEventListener($item, _this.onCmdsHandlers, _this);
                            }
                        }
                        else {
                            if (_this._notification.hasEventListener($item)) {
                                _this._notification.removeEventListener($item, _this.onCmdsHandlers, _this);
                            }
                        }
                    });
                }
            };
            /**
             * @inheritDoc
             * @param $destroy (default:true)
             */
            BaseMvcController.prototype.close = function ($destroy) {
                var _this = this;
                if ($destroy === void 0) { $destroy = false; }
                if (!$destroy)
                    $destroy = this._closeDestroy;
                return new Promise(function (resolve, reject) {
                    if (!$destroy) {
                        _this._view.close(false).then(function () {
                            resolve($destroy);
                        }).catch(function (e) { return console.log(e); });
                    }
                    else {
                        _this.destroy();
                        resolve($destroy);
                    }
                });
            };
            /**
             * @inheritDoc
             */
            BaseMvcController.prototype.getNotification = function () {
                return this._notification;
            };
            /**
             * @inheritDoc
             */
            BaseMvcController.prototype.getProxy = function () {
                return this._proxy;
            };
            /**
             * @inheritDoc
             */
            BaseMvcController.prototype.getView = function () {
                return this._view;
            };
            /**
             * @inheritDoc
             */
            BaseMvcController.prototype.destroy = function ($callback, $params) {
                var _this = this;
                this.listener2Cmds(false);
                if (this._notification) {
                    mvc.MvcMgr.Instance.putNotification(this._notification);
                    this._notification = null;
                }
                if (this._proxy) {
                    this._proxy.destroy();
                    this._proxy = null;
                }
                if (this._view) {
                    this._view.close(true).then(function () {
                        if (_this._destroyRes) {
                            RES.destroyRes(_this._key);
                            mvc.MvcMgr.Instance.setModuleRes(_this._key, false);
                        }
                    }).catch(function (e) { return console.log(e); });
                }
            };
            /**
             * @ignore
             */
            BaseMvcController.creatView = function ($name, $parent, $conf, $callback) {
                var $vClass = egret.getDefinitionByName($name);
                return new $vClass($parent, $conf, $callback);
            };
            return BaseMvcController;
        }());
        mvc.BaseMvcController = BaseMvcController;
        __reflect(BaseMvcController.prototype, "lib2egret.mvc.BaseMvcController", ["lib2egret.mvc.IMvcController", "lib2egret.common.IDestroy"]);
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
