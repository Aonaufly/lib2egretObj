module lib2egret.bind {
    export class BindTool {
        public static bind2Field<T>($subClass: any, $subField: string, $modClass: BindBaseModel, $modAttribute: string, $isInit: boolean = true): Bind2Subscriber<T> {
            let $sub: Bind2Subscriber<T> = new Bind2Subscriber();
            $sub.bind4Field($subClass, $subField, $modClass, $modAttribute, $isInit);
            return $sub;
        }
        public static bind2Callback<T>($callback: ($data: IBindEventData<T>) => void, $modClass: BindBaseModel, $modAttribute: string, $isInit: boolean = true): Bind2Subscriber<T> {
            let $sub: Bind2Subscriber<T> = new Bind2Subscriber();
            $sub.bind2Callback($callback, $modClass, $modAttribute, $isInit);
            return $sub;
        }
    }

    /**
     * 绑定属性
     * @param $field_name 字段名称
     * @param $modelFirst model优先
     */
    export function set2Bind<T>($field_name: string, $modelFirst: boolean = true) {
        return function (target: BindBaseModel, propertyKey: string, descriptor: PropertyDescriptor) {
            return {
                ...descriptor,
                set($value) {
                    if (typeof this.changedValue != "undefined") {
                        (this.changedValue as Function)($field_name, propertyKey, $value as T, $modelFirst);
                    } else {
                        console.error(`${egret.getQualifiedClassName(this)} need to extends parent class BindBaseModel!`);
                    }
                }
            }
        }
    }
}
