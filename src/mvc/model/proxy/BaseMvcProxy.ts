module lib2egret.mvc {
    /**
     * model代理基类
     * @author Aonaufly
     */
    export abstract class BaseMvcProxy implements common.IDestroy {
        /**数据model列表*/
        protected _models: common.HashMap<string, BaseMvcModel<any>>;
        /**controller的回调*/
        protected _callback: ($type: string, $data?: any) => void;

        public constructor($callback: ($type: string, $data?: any) => void) {
            this._models = new common.HashMap<string, BaseMvcModel<any>>();
            this._callback = $callback;
        }

        /**
         * 解析数据模型
         * @param $modelKey 模型Key
         * @param $data 数据
         */
        public abstract analysisModel($modelKey: string, $data: any): BaseMvcModel<any>|void;

        /**
         * 更新数据
         * @param $type 类型
         * @param $data 数据
         */
        public abstract update($type: string, $data: any): Promise<BaseMvcModel<any>|void>;

        /**
         * 获取模型
         * @param $modelKey 模型Key
         */
        public getModel($modelKey: string): BaseMvcModel<any> {
            if (this._models) {
                return this._models.getValue($modelKey);
            }
            return null;
        }

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            if (this._models) {
                this._models.destroy();
                this._models = null;
            }
            if (this._callback)
                this._callback = null;
            $callback && $callback($params);
        }
    }
}
