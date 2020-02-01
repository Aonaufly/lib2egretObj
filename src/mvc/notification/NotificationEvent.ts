module lib2egret.mvc {
    export class NotificationEvent<T> extends egret.Event {
        private _data: T;
        public constructor($type: string, $data: T) {
            super($type);
            this._data = $data;
        }
        public get Data(): T {
            return this._data;
        }
    }
}
