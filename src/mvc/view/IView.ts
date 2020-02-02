module lib2egret.mvc {
    /**
     * @ignore
     */
    export interface IView<T> {
        new($parent: egret.DisplayObjectContainer, $data: egret.XML, $callback: ($type: string, $data?: any) => void): IMvcView<T>;
    }

    /**
     * Mvc View接口
     * @author Aonaufly
     */
    export interface IMvcView<T> extends common.IDestroy{
        /**
         * show UI
         * @param $data 数据
         * @param $router 路由数据
         */
        open($data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): void;
        /**
         * 更新数据
         * @param $type 类型
         * @param $data 数据
         * @param $router 路由数据
         */
        update($type: string, $data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): Promise<void>;

        /**
         * 关闭UI
         * @param $destroy 是否销毁UI
         */
        close($destroy?: boolean): Promise<void>;

        /**
         * @inheritDoc
         */
        destroy($callback?: ($params?: any) => void, $params?: any): void;
    }
}
