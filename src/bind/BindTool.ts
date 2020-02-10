module lib2egret.bind {
    /**
     * 绑定工具
     * @author Aonaufly
     */
    export class BindTool {
        /**
         * 绑定属性（字段）
         * @param $subClass 监听类
         * @param $subField 监听类属性（字段）
         * @param $modClass model类
         * @param $modAttribute model类属性名称
         * @param $isInit 是否初始化数据
         */
        public static bind2Field<T>($subClass: any, $subField: string, $modClass: BindBaseModel, $modAttribute: string, $isInit: boolean = true): Bind2Subscriber<T> {
            let $sub: Bind2Subscriber<T> = new Bind2Subscriber();
            $sub.bind4Field($subClass, $subField, $modClass, $modAttribute, $isInit);
            return $sub;
        }

        /**
         * 绑定回调
         * @param $callback 回调函数
         * @param $modClass model类
         * @param $modAttribute model类属性名称
         * @param $isInit 是否初始化数据
         */
        public static bind2Callback<T>($callback: ($data: IBindEventData<T>) => void, $modClass: BindBaseModel, $modAttribute: string, $isInit: boolean = true): Bind2Subscriber<T> {
            let $sub: Bind2Subscriber<T> = new Bind2Subscriber();
            $sub.bind2Callback($callback, $modClass, $modAttribute, $isInit);
            return $sub;
        }
    }

    /**
     * Model绑定属性
     * @param $field_name 字段名称
     * @param $modelFirst model优先
     */
    export function set2Bind<T>($field_name: string, $modelFirst: boolean = true):any {
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
