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
         * 普通UI基类
         * @author Aonaufly
         */
        var BaseView = (function (_super) {
            __extends(BaseView, _super);
            function BaseView($parent, $data, $callback) {
                var _this = _super.call(this) || this;
                _this._closeCD = null;
                _this.startCloseCD = function () {
                    if (!_this._closeCD)
                        return;
                    lib2egret.common.TimerMgr.Instance.bindCD(egret.getQualifiedClassName(_this), _this._closeCD, _this.timer2CloseCD, true);
                };
                /**
                 * 关闭UI触发
                 * @param $destroy 是否销毁
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
                _this.init2UI();
                return _this;
            }
            BaseView.prototype.analysisParamXml = function ($data) {
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
             * 设置对象的坐标
             */
            BaseView.prototype.setLo = function () {
                this.x = (this._parent.width - this.width) >> 1;
                this.y = (this._parent.height - this.height) >> 1;
            };
            /**
             * @inheritDoc
             */
            BaseView.prototype.open = function ($data, $router) {
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
                this.listener(true);
                this.goRouter($router);
            };
            /**
             * 走路由
             * @param $router
             */
            BaseView.prototype.goRouter = function ($router) {
                if (!$router)
                    return;
            };
            /**
             * @inheritDoc
             */
            BaseView.prototype.close = function ($destroy) {
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
            BaseView.prototype.destroy = function ($callback, $params) {
                this._mask = null;
                this._eff = null;
                this._callback = null;
                $callback && $callback($params);
            };
            return BaseView;
        }(egret.DisplayObjectContainer));
        mvc.BaseView = BaseView;
        __reflect(BaseView.prototype, "lib2egret.mvc.BaseView", ["lib2egret.mvc.IMvcView", "lib2egret.common.IDestroy"]);
    })(mvc = lib2egret.mvc || (lib2egret.mvc = {}));
})(lib2egret || (lib2egret = {}));
