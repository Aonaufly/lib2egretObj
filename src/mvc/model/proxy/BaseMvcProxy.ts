module lib2egret.mvc {
    export abstract class BaseMvcProxy implements common.IDestroy {
        protected _models: common.HashMap<string, BaseMvcModel<any>>;
        protected _callback: ($type: string, $data?: any) => void;

        public constructor($callback: ($type: string, $data?: any) => void) {
            this._models = new common.HashMap<string, BaseMvcModel<any>>();
            this._callback = $callback;
        }

        /**
         * 解析数据模型
         * @param $modelKey
         * @param $data
         */
        public abstract analysisModel($modelKey: string, $data: any): void;

        /**
         * 更新数据
         * @param $type
         * @param $data
         */
        public abstract update($type: string, $data: any): Promise<void>;

        public getModel($modelName: string): BaseMvcModel<any> {
            if (this._models) {
                return this._models.getValue($modelName);
            }
            return null;
        }

        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            if (this._models) {
                this._models.destroy();
                this._models = null;
            }
            if (this._callback)
                this._callback = null;
        }
    }
}
