module lib2egret.mvc {
    /**
     * MVC 模块通讯事件
     * @author Aonaufly
     */
    export class NotificationEvent<T> extends egret.Event {
        private _data: T;

        /**
         * @ignore
         */
        public constructor($type: string, $data: T) {
            super($type);
            this._data = $data;
        }

        /**
         * 获取数据
         */
        public get Data(): T {
            return this._data;
        }
    }
}
