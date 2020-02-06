module lib2egret.bind {
    /**
     * @ignore
     */
    export class BindEvent<T, D extends IBindEventData<T>> extends egret.Event {
        private static readonly BIND_CMD: string = `BIND_CMD`;
        public static getCMD($attribute: string): string {
            return `${BindEvent.BIND_CMD}_2_${$attribute}`;
        }
        public constructor($type: string, $data: D) {
            super($type, true, true, $data);
        }
        public get Data(): D {
            return this.data;
        }
    }
}
