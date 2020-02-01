module lib2egret.common {
    export interface IDestroy {
        clear?($callback?: ($params?: any) => void, $params?: any): void;
        destroy($callback?: ($params?: any) => void, $params?: any): void;
    }
}
