module lib2egret.mvc {
    export interface IView<T> {
        new($parent: egret.DisplayObjectContainer, $data: egret.XML, $callback: ($type: string, $data?: any) => void): IMvcView<T>;
    }
    export interface IMvcView<T> {
        open($data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): void;
        /**
         * 更新数据
         * @param $type
         * @param $data
         * @param $router
         */
        update($type: string, $data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): Promise<void>;
        close($destroy?: boolean): Promise<void>;
        destory($callback?: ($params?: any) => void, $params?: any): void;
    }
}
