module lib2egret.mvc {
    /**
     * 数据模型
     * @author Aonaufly
     */
    export abstract class BaseMvcModel<T> implements common.IDestroy {
        public _data: IMvcVO<T>;

        public abstract analysisData($data: any): void;

        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            if (this._data) {
                this._data = null;
            }
        }
    }
}
