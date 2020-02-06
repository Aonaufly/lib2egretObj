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
         * EUI基类
         * @author Aonaufly
         */
        var BaseEuiView = (function (_super) {
            __extends(BaseEuiView, _super);
            function BaseEuiView($parent, $data, $callback) {
                var _this = _super.call(this) || this;
                _this._closeCD = null;
                _this._isInit = false;
                _this._wait = null;
                _this.startCloseCD = function () {
                    _this.listener(true);
                    if (!_this._closeCD)
                        return;
                    lib2egret.common.TimerMgr.Instance.bindCD(egret.getQualifiedClassName(_this), _this._closeCD, _this.timer2CloseCD, true);
                };
                /**
                 * 关闭触发
                 */
                _this.onClosed = function ($destroy) {
                    lib2egret.common.CommonTool.remove4Parent(_this._mask);
                    lib2egret.common.CommonTool.remove4Parent(_this);
                    lib2egret.common.TimerMgr.Instance.removeBind(egret.getQualifiedClassName(_this));
                    $destroy && _this.destroy();
                };
                _this._parent = $parent;
                _this._callback = $callback;
                $data && _this.analysisParamXml($data);
                return _this;
            }
            BaseEuiView.prototype.analysisParamXml = function ($data) {
                var $params;
                if ($data["$mask"]) {
                    $params = $data["$mask"].trim();
                    var $color = 0x000000, $alpha = 0.7;
                    if ($params.indexOf("|") > 0) {
                        var $arr = $params.split("|");
                        $color = parseInt($arr[0]);
                        $alpha = parseFloat($arr[1]);
                    }
                    this._mask = new egret.Shape();
                    this._mask.width = this._parent.width;
                    this._mask.height = this._parent.height;
                    this._mask.graphics.beginFill($color, $alpha);
                    this._mask.graphics.drawRect(0, 0, this._parent.width, this._parent.height);
                    this._mask.graphics.endFill();
                    this._mask.touchEnabled = true;
                }
                if ($data["$effect"]) {
                    $params = $data["$effect"].trim();
                    var $eClass = egret.getDefinitionByName($params);
                    this._eff = new $eClass(this, this._mask);
                }
                if ($data["$closecd"] && +$data["$closecd"] > 0) {
                    this._closeCD = +$data["$closecd"];
                }
            };
            /**
             * @inheritDoc
             */
            BaseEuiView.prototype.childrenCreated = function () {
                _super.prototype.childrenCreated.call(this);
                this._isInit = true;
                if (this._wait != null) {
                    if (this._wait.hasOwnProperty("noParams")) {
                        this.setUI(null, this._wait.router);
                    }
                    else {
                        this.setUI(this._wait.data, this._wait.router);
                    }
                    this._wait = null;
                }
            };
            /**
             * 设置对象最表
             */
            BaseEuiView.prototype.setLo = function () {
                this.x = (this._parent.width - this.width) >> 1;
                this.y = (this._parent.height - this.height) >> 1;
            };
            /**
             * @inheritDoc
             * 切勿重写
             */
            BaseEuiView.prototype.open = function ($data, $router) {
                if (this._isInit) {
                    this.setUI($data, $router);
                }
                else {
                    if ($data != null) {
                        this._wait = { data: $data, router: $router };
                    }
                    else {
                        this._wait = { noParams: true, router: $router };
                    }
                }
            };
            /**
             * 设置UI
             * @param $data 打开数据
             * @param $router 路由数据
             */
            BaseEuiView.prototype.setUI = function ($data, $router) {
                this._data = $data;
                if (this._mask) {
                    this._parent.addChild(this._mask);
                }
                this.setLo();
                if (this._eff) {
                    this._eff.open().then(this.startCloseCD).catch(function (e) { return console.log(e); });
                }
                else {
                    this.startCloseCD();
                }
                this._parent.addChild(this);
                this.goRouter($router);
            };
            /**
             * 走路由
             * @param $router
             */
            BaseEuiView.prototype.goRouter = function ($router) {
                if (!$router)
                    return;
            };
            /**
             * @inheritDoc
             */
            BaseEuiView.prototype.close = function ($destroy) {
                var _this = this;
                if ($destroy === void 0) { $destroy = false; }
                this.listener(false);
                return new Promise(function (resolve, reject) {
                    if (_this._eff) {
                        _this._eff.close($destroy).then(function ($destroy) {
                            _this.onClosed($destroy);
                            resolve();
                        }).catch(function (e) { return console.log(e); });
                    }
                    else {
                        _this.onClosed($destroy);
                        resolve();
                    }
                });
            };
            /**
             * @inheritDoc
             */
            BaseEuiView.prototype.destroy = function ($callback, $params) {
                this._mask = null;
                this._eff = null;
                this._callback = null;
            };
            return BaseEuiView;
        }(eui.Component));
        mvc.BaseEuiView = BaseEuiView;
        __reflect(BaseEuiView.prototype, "lib2egret.mvc.BaseEuiView", ["lib2egret.mvc.IMvcView", "lib2egret.common.IDestroy"]);
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
