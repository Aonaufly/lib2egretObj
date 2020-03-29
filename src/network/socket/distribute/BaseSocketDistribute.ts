module lib2egret.network {
    /**
     * @ignore
     */
    export interface ISocketDistribute<HEAD extends ISocketHead> {
        new($bodyAnalysis: IBaseSocketBodyAnalysis<HEAD>, $config: egret.XMLNode | JSON): BaseSocketDistribute<HEAD>;
    }

    /**
     * Socket系统分发
     * @author Aonaufly
     */
    export abstract class BaseSocketDistribute<HEAD extends ISocketHead> implements common.IDestroy {
        /**实体内容解析器 */
        protected _bodyAnalysis: BaseSocketBodyAnalysis<HEAD>;
        /**实体 */
        protected _entity: any;

        public constructor($bodyAnalysis: IBaseSocketBodyAnalysis<HEAD>, $config: egret.XMLNode | JSON) {
            this._bodyAnalysis = new $bodyAnalysis($config);
        }

        /**
         * 分发消息（需要解析成实体）
         * @param $head 包头
         * @param $body 包体
         */
        public distribute($head: HEAD, $body: SByteArray): void {
            this._entity = this._bodyAnalysis.execute2Plaintext($head, $body);//解析出Body
        }

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this._bodyAnalysis.destroy();
            this._bodyAnalysis = null;
            $callback && $callback($params);
        }
    }
}
