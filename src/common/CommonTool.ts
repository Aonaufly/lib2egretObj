module lib2egret.common {
    /**
     * 通用工具
     * @author Aonaufly
     */
    export class CommonTool {
        /**
         * 将显示对象移除
         * @param $cell 显示对象
         */
        public static remove4Parent($cell: egret.DisplayObject): void {
            if ($cell && $cell.parent) {
                $cell.parent.removeChild($cell);
            }
        }

        /**
         * 停止Tween动画
         * @param $tw Tween实例
         */
        public static stop4Tw($tw: egret.Tween): void {
            $tw && $tw.setPaused(true);
        }

        /**
         * 将显示对象移至最高层级
         * @param $cell 显示对象
         */
        public static pring2Top($cell: egret.DisplayObject): void {
            if ($cell && $cell.parent) {
                $cell.parent.setChildIndex($cell, $cell.parent.numChildren);
            }
        }
    }
}
