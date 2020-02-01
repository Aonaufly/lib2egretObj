module lib2egret.common {
    /**
     * loading接口
     * @author Aonaufly
     */
    export interface ILoading extends egret.DisplayObjectContainer {
        update($all?: number, $loaded?: number): Promise<void>;
        close($destroy?: boolean): Promise<void>;
        destroy($callback?: ($params?: any) => void, $params?: any): void;
    }
}
