var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var bind;
    (function (bind) {
        /**
         * 绑定对象句柄
         * @author Aonaufly
         */
        var Bind2Subscriber = (function () {
            function Bind2Subscriber() {
            }
            /**
             * @ignore
             */
            Bind2Subscriber.prototype.bind4Field = function ($subClass, $subField, $modClass, $modAttribute, $isInit) {
                if ($isInit === void 0) { $isInit = true; }
                this._subClass = $subClass;
                this._subField = $subField;
                this._modClass = $modClass;
                this._modAttribute = $modAttribute;
                if ($isInit) {
                    this._subClass[this._subField] = this._modClass[this._modAttribute];
                }
                this.listener(true, this._modAttribute);
            };
            /**
             * @ignore
             */
            Bind2Subscriber.prototype.bind2Callback = function ($callback, $modClass, $modAttribute, $isInit) {
                if ($isInit === void 0) { $isInit = true; }
                this._callback = $callback;
                this._modClass = $modClass;
                this._modAttribute = $modAttribute;
                if ($isInit) {
                    this._callback({
                        $old: null,
                        $new: this._modClass[this._modAttribute],
                        $attribute: this._modAttribute,
                        $modelFirst: null,
                        $modelClass: this._modClass
                    });
                }
                this.listener(true, this._modAttribute);
            };
            Bind2Subscriber.prototype.listener = function ($isAdd, $attribute) {
                if ($isAdd) {
                    bind.BindDispatcher.Instance.addEventListener(bind.BindEvent.getCMD($attribute), this.onBindEvent, this);
                }
                else {
                    bind.BindDispatcher.Instance.removeEventListener(bind.BindEvent.getCMD($attribute), this.onBindEvent, this);
                }
            };
            Bind2Subscriber.prototype.onBindEvent = function ($e) {
                if ($e.Data.$modelClass == this._modClass) {
                    if (this._callback) {
                        this._callback($e.Data);
                    }
                    else {
                        this._subClass[this._subField] = $e.Data.$new;
                    }
                }
            };
            /**
             * @inheritDoc
             */
            Bind2Subscriber.prototype.destroy = function ($callback, $params) {
                this.listener(false, this._modAttribute);
                if (this._subClass)
                    this._subClass = null;
                if (this._modClass)
                    this._modClass = null;
                if (this._callback)
                    this._callback = null;
                $callback && $callback($params);
            };
            return Bind2Subscriber;
        }());
        bind.Bind2Subscriber = Bind2Subscriber;
        __reflect(Bind2Subscriber.prototype, "lib2egret.bind.Bind2Subscriber", ["lib2egret.common.IDestroy"]);
    })(bind = lib2egret.bind || (lib2egret.bind = {}));
})(lib2egret || (lib2egret = {}));
