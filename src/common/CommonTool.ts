module lib2egret.common {

    export class CommonTool {
        public static remove4Parent($cell: egret.DisplayObject): void {
            if ($cell && $cell.parent) {
                $cell.parent.removeChild($cell);
            }
        }

        public static stop4Tw($tw: egret.Tween): void {
            $tw && $tw.setPaused(true);
        }

        public static pring2Top($cell: egret.DisplayObject): void {
            if ($cell && $cell.parent) {
                $cell.parent.setChildIndex($cell, $cell.parent.numChildren);
            }
        }
    }
}
