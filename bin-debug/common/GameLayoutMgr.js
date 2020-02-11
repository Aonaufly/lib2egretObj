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
    var common;
    (function (common) {
        /**
         * 层级管理器
         * @author Aonaufly
         */
        var GameLayoutMgr = (function (_super) {
            __extends(GameLayoutMgr, _super);
            function GameLayoutMgr() {
                return _super.call(this) || this;
            }
            Object.defineProperty(GameLayoutMgr, "Instance", {
                /**
                 * 获取单例对象句柄
                 */
                get: function () {
                    if (!GameLayoutMgr._instance)
                        GameLayoutMgr._instance = new GameLayoutMgr();
                    return GameLayoutMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 初始化
             * @param $stage 舞台
             * @param $designSize 设计尺寸
             * @param $listLayoutNum 层级数量(defau:5)
             */
            GameLayoutMgr.prototype.init = function ($stage, $designSize, $listLayoutNum) {
                if ($listLayoutNum === void 0) { $listLayoutNum = 5; }
                this._gameStage = $stage;
                this._designSize = $designSize;
                this.setLayout($listLayoutNum);
            };
            GameLayoutMgr.prototype.setLayout = function ($num) {
                this._listLayout = new Array($num);
                var $cell;
                for (var $i = 0; $i < $num; $i++) {
                    $cell = new egret.DisplayObjectContainer();
                    $cell.width = this.GameStage.stageWidth;
                    $cell.height = this.GameStage.stageHeight;
                    this._gameStage.addChild($cell);
                    this._listLayout[$i] = $cell;
                }
            };
            Object.defineProperty(GameLayoutMgr.prototype, "GameStage", {
                /**
                 * 获取舞台
                 */
                get: function () {
                    return this._gameStage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameLayoutMgr.prototype, "DesignSize", {
                /**
                 * 获取设计尺寸
                 */
                get: function () {
                    return this._designSize;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取层级
             * @param $index 层级序号（从0开始）
             */
            GameLayoutMgr.prototype.getLayout = function ($index) {
                if ($index < 0 || $index >= this._listLayout.length) {
                    console.error("Hierarchy param between 0 ~ " + (this._listLayout.length - 1) + "!");
                    return null;
                }
                return this._listLayout[$index];
            };
            Object.defineProperty(GameLayoutMgr.prototype, "Layouts", {
                /**
                 * 获取全部层级
                 */
                get: function () {
                    return this._listLayout;
                },
                enumerable: true,
                configurable: true
            });
            return GameLayoutMgr;
        }(common.BaseSingle));
        common.GameLayoutMgr = GameLayoutMgr;
        __reflect(GameLayoutMgr.prototype, "lib2egret.common.GameLayoutMgr");
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
