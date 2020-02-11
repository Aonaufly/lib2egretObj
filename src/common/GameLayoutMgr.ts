module lib2egret.common {
    /**
     * 层级管理器
     * @author Aonaufly
     */
    export class GameLayoutMgr extends BaseSingle {
        /**
         * 获取单例对象句柄
         */
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

        /**
         * 初始化
         * @param $stage 舞台
         * @param $designSize 设计尺寸
         * @param $listLayoutNum 层级数量(defau:5)
         */
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
                $cell.width = this.GameStage.stageWidth;
                $cell.height = this.GameStage.stageHeight;
                this._gameStage.addChild($cell);
                this._listLayout[$i] = $cell;
            }
        }

        /**
         * 获取舞台
         */
        public get GameStage(): egret.Stage {
            return this._gameStage;
        }

        /**
         * 获取设计尺寸
         */
        public get DesignSize(): { width: number, height: number } {
            return this._designSize;
        }

        /**
         * 获取层级
         * @param $index 层级序号（从0开始）
         */
        public getLayout($index: number): egret.DisplayObjectContainer {
            if ($index < 0 || $index >= this._listLayout.length) {
                console.error(`Hierarchy param between 0 ~ ${this._listLayout.length - 1}!`);
                return null;
            }
            return this._listLayout[$index];
        }

        /**
         * 获取全部层级
         */
        public get Layouts(): Array<egret.DisplayObjectContainer> {
            return this._listLayout;
        }
    }
}
