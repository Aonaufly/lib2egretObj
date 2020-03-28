module lib2egret.network {
    /**
     * 数据Body的解析
     */
    export abstract class BaseSocketBodyAnalysis<HEAD extends ISocketHead> implements common.IDestroy {
        /**
         * 配置文件
         */
        protected _config: egret.XMLNode | JSON;

        public constructor($config: egret.XMLNode | JSON) {
            this._config = $config;
        }

        /**
         * 开始组装Body
         * @param $head
         * @param $data
         */
        public abstract execute2Plaintext<BODY>($head: HEAD, $data: SByteArray): BODY;

        /**
         * 开始将body制成二进制
         * @param $head
         * @param $data
         */
        public abstract execute2Ciphertext<BODY>($head: HEAD, $data: BODY): SByteArray;

        /**
         * 基础元素的解析
         * @param $data
         */
        protected abstract baseItemAnalysis<T>($data: SByteArray): T;

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this._config = null;
            $callback && $callback($params);
        }
    }

    export interface IBaseSocketBodyAnalysis<HEAD extends ISocketHead> {
        new($config: egret.XMLNode | JSON): BaseSocketBodyAnalysis<HEAD>;
    }

}
