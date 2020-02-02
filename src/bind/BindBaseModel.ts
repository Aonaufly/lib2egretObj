module lib2egret.bind {
    /**
     * model绑定基类
     * @author Aonaufly
     */
    export abstract class BindBaseModel {
        /**
         *@ignore
         */
        protected changedValue<T>($field: string, $attribute: string, $value: T, $modelFirst: boolean = true): void {
            if (this[$field] != $value) {
                const $old: T = this[$field];
                if ($modelFirst) {
                    this[$field] = $value;
                }
                BindDispatcher.Instance.send<T>($attribute, $old, $value, this, $modelFirst);
                if (!$modelFirst) {
                    this[$field] = $value;
                }
            }
        }
    }
}
