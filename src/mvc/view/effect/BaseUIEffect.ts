module lib2egret.mvc {
    /**
     * View打开关闭特效基类
     * @author Aonaufly
     */
    export abstract class BaseUIEffect implements common.IDestroy {
        protected _main: egret.DisplayObjectContainer;
        protected _mask: egret.DisplayObject;
        protected readonly _initMainLo: { x: number, y: number };
        protected readonly _initMaskAlpha: number;

        public constructor($main: egret.DisplayObjectContainer, $mask: egret.DisplayObject) {
            this._main = $main;
            this._mask = $mask;
            this._initMainLo = {
                x: this._main.x,
                y: this._main.y
            };
            this._initMaskAlpha = this._mask.alpha;
        }

        public abstract async open(): Promise<void>;

        public abstract async close($destory: boolean): Promise<boolean>;

        public abstract destroy($callback?: ($params?: any) => void, $params?: any): void;
    }
}
