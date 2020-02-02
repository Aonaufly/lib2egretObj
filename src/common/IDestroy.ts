module lib2egret.common {
    /**
     * 销毁接口
     * @author Aonaufly
     */
    export interface IDestroy {
        /**
         * 清理
         * @param $callback 清理后的回调
         * @param $params 回调的参数
         */
        clear?($callback?: ($params?: any) => void, $params?: any): void;

        /**
         * 销毁
         * @param $callback 销毁后的回调
         * @param $params 回调的参数
         */
        destroy($callback?: ($params?: any) => void, $params?: any): void;
    }
}
