module lib2egret.bind {
    export class Bind2Subscriber<T> implements common.IDestroy {
        private _subClass: any;
        private _subField: string;
        private _modClass: BindBaseModel;
        private _modAttribute: string;
        private _callback: ($data: IBindEventData<T>) => void;

        public bind4Field($subClass: any, $subField: string, $modClass: BindBaseModel, $modAttribute: string, $isInit: boolean = true): void {
            this._subClass = $subClass;
            this._subField = $subField;
            this._modClass = $modClass;
            this._modAttribute = $modAttribute;
            if ($isInit) {
                this._subClass[this._subField] = this._modClass[this._modAttribute];
            }
            this.listener(true, this._modAttribute);
        }

        public bind2Callback($callback: ($data: IBindEventData<T>) => void, $modClass: BindBaseModel, $modAttribute: string, $isInit: boolean = true): void {
            this._callback = $callback;
            this._modClass = $modClass;
            this._modAttribute = $modAttribute;
            if ($isInit) {
                this._callback({
                    $old: null,
                    $new: this._modClass[this._modAttribute],
                    $attribute: this._modAttribute,
                    $modelFirst: null,
                    $modelClass: this._modClass
                });
            }
            this.listener(true, this._modAttribute);
        }

        private listener($isAdd: boolean, $attribute: string): void {
            if ($isAdd) {
                BindDispatcher.Instance.addEventListener(BindEvent.getCMD($attribute), this.onBindEvent);
            } else {
                BindDispatcher.Instance.removeEventListener(BindEvent.getCMD($attribute), this.onBindEvent);
            }
        }

        private onBindEvent($e: BindEvent<IBindEventData<T>>): void {
            if ($e.detail.$modelClass == this._modClass) {
                if (this._callback) {
                    this._callback($e.detail);
                } else {
                    this._subClass[this._subField] = $e.detail.$new;
                }
            }
        }

        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this.listener(false, this._modAttribute);
            if (this._subClass) this._subClass = null;
            if (this._modClass) this._modClass = null;
            if (this._callback) this._callback = null;
        }
    }
}
