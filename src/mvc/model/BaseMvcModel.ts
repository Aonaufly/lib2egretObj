module lib2egret.mvc {
    /**
     * 数据模型
     * @author Aonaufly
     */
    export abstract class BaseMvcModel<T> implements common.IDestroy {
        /**数据VO*/
        public _data: IMvcVO<T>;

        /**
         * 解析数据
         * @param $data 数据
         */
        public abstract analysisData($data: any): void;

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            if (this._data) {
                this._data = null;
            }
        }
    }
}
