module lib2egret.bind {
    export class BindEvent<T> extends CustomEvent<T>{
        private static readonly BIND_CMD: string = `BIND_CMD`;
        public static getCMD($attribute: string): string {
            return `${BindEvent.BIND_CMD}_2_${$attribute}`;
        }
        public constructor($type: string, $data: T) {
            super($type, { detail: $data, bubbles: true, cancelable: true, composed: true });
        }
    }
}
