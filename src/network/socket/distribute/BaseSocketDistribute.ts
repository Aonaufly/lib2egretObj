module lib2egret.network {
    export interface ISocketDistribute<HEAD extends ISocketHead, BODY> {
        new(): BaseSocketDistribute<HEAD, BODY>;
    }

    /**
     * Socket系统分发
     * @author Aonaufly
     */
    export abstract class BaseSocketDistribute<HEAD extends ISocketHead, BODY>{
        /**
         * 分发消息
         * @param $head 包头
         * @param $body 包体
         * @return 是否为心跳包
         */
        public abstract distribute($head: HEAD, $body: BODY): boolean;
    }
}
