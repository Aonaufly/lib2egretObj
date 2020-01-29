module lib2egret.common {
    export interface IDestroy {
        clear?(): void;
        destory($callback?: ($params?: any) => void, $params?: any): void;
    }
}
