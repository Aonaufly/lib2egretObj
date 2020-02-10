module lib2egret.common {
    /**
     * loading接口
     * @author Aonaufly
     */
    export interface ILoading extends egret.DisplayObjectContainer {
        /**
         * 更新进度
         * @param $all 总量
         * @param $loaded 已加载的量
         */
        update($all?: number, $loaded?: number): Promise<void>;

        /**
         * 关闭UI界面
         * @param $destroy 是否销毁
         */
        close($destroy?: boolean): Promise<void>;

        /**
         * 销毁
         * @param $callback
         * @param $params
         */
        destroy($callback?: ($params?: any) => void, $params?: any): void;
    }
}
