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
        protected _bodyAnalysis: BaseSocketBodyAnalysis<HEAD>;

        public constructor($bodyAnalysis: IBaseSocketBodyAnalysis<HEAD>, $config: egret.XMLNode | JSON) {
            this._bodyAnalysis = new $bodyAnalysis($config);
        }

        /**
         * 分发消息（需要解析成Model）
         * @param $head 包头
         * @param $body 包体
         */
        public abstract distribute($head: HEAD, $body: SByteArray): void;

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
