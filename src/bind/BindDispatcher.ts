module lib2egret.bind {
    /**
     * @ignore
     */
    export class BindDispatcher extends egret.EventDispatcher {
        private static _instance: BindDispatcher;
        public static get Instance(): BindDispatcher {
            if (!BindDispatcher._instance)
                BindDispatcher._instance = new BindDispatcher();
            return BindDispatcher._instance;
        }
        private constructor() {
            super();
        }
        public send<T>($attribute: string, $old: T, $new: T, $modelClass: BindBaseModel, $modelFirst: boolean): void {
            const $cmd: string = BindEvent.getCMD($attribute);
            if (this.hasEventListener($cmd)) {
                const $event: BindEvent<T, IBindEventData<T>> = new BindEvent($cmd, {
                    $old: $old,
                    $new: $new,
                    $attribute: $attribute,
                    $modelFirst: $modelFirst,
                    $modelClass: $modelClass
                });
                this.dispatchEvent($event);
            }
        }
    }

    export interface IBindEventData<T> {
        $old: T;
        $new: T;
        $attribute: string;
        $modelFirst: boolean;
        $modelClass: BindBaseModel;
    }
}
