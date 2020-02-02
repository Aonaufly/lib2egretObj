module lib2egret.common {
    /**
     * 层级管理器
     * @author Aonaufly
     */
    export class GameLayoutMgr extends BaseSingle {
        public static get Instance(): GameLayoutMgr {
            if (!GameLayoutMgr._instance)
                GameLayoutMgr._instance = new GameLayoutMgr();
            return <GameLayoutMgr>GameLayoutMgr._instance;
        }
        private constructor() {
            super();
        }
        private _gameStage: egret.Stage;
        private _designSize: { width: number, height: number };
        private _listLayout: Array<egret.DisplayObjectContainer>;
        public init($stage: egret.Stage, $designSize: { width: number, height: number }, $listLayoutNum: number = 5): void {
            this._gameStage = $stage;
            this._designSize = $designSize;
            this.setLayout($listLayoutNum);
        }
        private setLayout($num: number): void {
            this._listLayout = new Array<egret.DisplayObjectContainer>($num);
            let $cell: egret.DisplayObjectContainer;
            for (let $i: number = 0; $i < $num; $i++) {
                $cell = new egret.DisplayObjectContainer();
                $cell.width = this._gameStage.width;
                $cell.height = this._gameStage.height;
                $cell.touchEnabled = false;
                $cell.touchChildren = true;
                this._gameStage.addChildAt($cell, $i);
                this._listLayout.push($cell);
            }
        }
        public get GameStage(): egret.Stage {
            return this._gameStage;
        }
        public get DesignSize(): { width: number, height: number } {
            return this._designSize;
        }
        public getLayout($index: number): egret.DisplayObjectContainer {
            if ($index < 0 || $index >= this._listLayout.length) {
                console.error(`Hierarchy param between 0 ~ ${this._listLayout.length - 1}!`);
                return null;
            }
            return this._listLayout[$index];
        }

        public get Layouts(): Array<egret.DisplayObjectContainer> {
            return this._listLayout;
        }
    }
}
