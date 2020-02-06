var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var common;
    (function (common) {
        /**
         * 通用工具
         * @author Aonaufly
         */
        var CommonTool = (function () {
            function CommonTool() {
            }
            /**
             * 将显示对象移除
             * @param $cell 显示对象
             */
            CommonTool.remove4Parent = function ($cell) {
                if ($cell && $cell.parent) {
                    $cell.parent.removeChild($cell);
                }
            };
            /**
             * 停止Tween动画
             * @param $tw Tween实例
             */
            CommonTool.stop4Tw = function ($tw) {
                $tw && $tw.setPaused(true);
            };
            /**
             * 将显示对象移至最高层级
             * @param $cell 显示对象
             */
            CommonTool.pring2Top = function ($cell) {
                if ($cell && $cell.parent) {
                    $cell.parent.setChildIndex($cell, $cell.parent.numChildren);
                }
            };
            return CommonTool;
        }());
        common.CommonTool = CommonTool;
        __reflect(CommonTool.prototype, "lib2egret.common.CommonTool");
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
