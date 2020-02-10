module lib2egret.common {
    /**
     * HashMap : Map关系映射数据集类
     * <b style="color:blue">K : 键  V : 值 , 本版可提供二分查找功能,相较于上一版查找性能有大幅提升(注意:使用二分查找需要事先排序)</b>
     * <b style="color:red">
     *     目前仅提供Key(键<K>)类型为 string , number的二分查找功能
     * </b>
     * @author Aonaufly
     */
    export class HashMap<K, V> implements IDestroy {
        private _content: Array<IConten2MapHash<K, V>>;
        private _type_sort: TYPE_SORT;
        private _open_binarySearch: Boolean;

        /**
         * <b style="color:red">
         *     使用二分查找需要先对数据集($key)进行ASC/DES排序 , 如果初始数据$initData已经排过序则将$needSort设为false,反之将$needSort设为true->构造函数会自动排序
         *
         *     如果$initData事先已经进行了排序,则没有必要进行排序
         *     注意 : $typeSort排序类型一定要正确
         *     ---------仅支持 : key为String/Number类型的二分查找
         * </b>
         * @param $initData 初始值( default : false)
         * @param $typeSort 排序类型( default : Data_sets.TYPE_SORT.___ASC___)
         * @param $useBinarySearch 是否使用二分查找( default : false )
         * @param $needSort 如果用二分查找则虚部需要排序( default : false )
         * @param $checkKey 是否检测$initData有重复的Key值<用来检测数据Key重复的错误 , 上线后建议设为false , 以提高性能>( default : false )
         */
        public constructor($initData: Array<IConten2MapHash<K, V>> = null, $typeSort: TYPE_SORT = TYPE_SORT.___ASC___, $useBinarySearch: boolean = false, $needSort: boolean = false, $checkKey: boolean = false) {
            this._type_sort = $typeSort;
            if (!$initData || $initData.length == 0) {
                this._content = [];
            } else {
                if ($checkKey) {
                    this.checkInitData2Unrepeat4Keys($initData);
                }
                if ($useBinarySearch) {
                    const $data: IConten2MapHash<K, V> = $initData[0];
                    if (typeof ($data._key) == "string" || typeof ($data._key) == "number") {
                        this._open_binarySearch = true;
                        if ($needSort) {
                            //对$initData进行排序
                            $initData.sort(($a: IConten2MapHash<K, V>, $b: IConten2MapHash<K, V>): number => {
                                const $a_key: K = $a._key;
                                const $b_key: K = $b._key;
                                switch (this._type_sort) {
                                    case TYPE_SORT.___ASC___:
                                        if (typeof ($data._key) == "number") {
                                            return (+$a_key) - (+$b_key);
                                        } else {
                                            return this.strCompare(<string><any>$a_key, <string><any>$b_key);
                                        }
                                    case TYPE_SORT.___DES___:
                                        if (typeof ($data._key) == "number") {
                                            return (+$b_key) - (+$a_key);
                                        } else {
                                            return this.strCompare(<string><any>$b_key, <string><any>$a_key);
                                        }
                                }
                            });
                        }
                    } else {
                        this._open_binarySearch = false;
                    }
                    this._content = $initData;
                } else {
                    this._open_binarySearch = false;
                    this._content = $initData;
                }
            }
        }

        /**
         * 初始值的Key键是否没有重复
         * @param {Array<Data_sets.IConten2MapHash<K, V>>} $initData
         * @returns {boolean}
         */
        private checkInitData2Unrepeat4Keys($initData: Array<IConten2MapHash<K, V>>): boolean {
            if ($initData.length == 1) {
                return true;
            }
            let $cell_i: IConten2MapHash<K, V> = null;
            let $cell_n: IConten2MapHash<K, V> = null;
            for (let $i: number = 0, $j: number = $initData.length; $i < $j; $i++) {
                $cell_i = $initData[$i];
                for (let $n: number = $i + 1; $n < $j; $n++) {
                    $cell_n = $initData[$n];
                    if ($cell_n._key == $cell_i._key) {
                        console.error(`初始化Key值重复 : ${$cell_i._key}`);
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * 重新设置根据Key的排序方式
         * @param $value 排序方案
         */
        public setType2Sort($value: TYPE_SORT): void {
            if (this._type_sort != $value) {
                this._type_sort = $value;
                if (this._content.length > 1 && this._open_binarySearch) {
                    this._content = this._content.reverse();
                }
            }
        }

        /**
         * 获得本数据集的排序方式(只读)
         */
        public get type2Sort(): TYPE_SORT {
            return this._type_sort;
        }

        /**
         * 比较2个字符串的大小
         * @param $a
         * @param $b
         */
        private strCompare($a: string, $b: string): number {
            const $a_len: number = $a.length;
            const $b_len: number = $b.length;
            const $j: number = $a_len >= $b_len ? $a_len : $b_len;
            let $a_ascii: number = null, $b_ascii: number = null;
            for (let $i: number = 0; $i < $j; $i++) {
                $a_ascii = $i < $a_len ? $a.charCodeAt($i) : -1;
                $b_ascii = $i < $b_len ? $b.charCodeAt($i) : -1;
                if ($a_ascii != $b_ascii) {
                    return $a_ascii - $b_ascii;
                }
            }
        }

        /**
         * 是否存在此键
         * @param $key 键值
         * @returns 是否存在
         */
        public containsKey($key: K): boolean {
            if (!this._content || this._content.length == 0) return false;
            return this.getKeyIndex($key) > -1;
        }

        /**
         * 获得Key所在的下标
         * <b style="color:red">
         *     若没找到,返回-1
         * </b>
         * @param $key
         * @returns number
         */
        private getKeyIndex($key: K): number {
            const $all_len: number = this._content.length;
            if (!this._open_binarySearch || $all_len <= 1) {
                if ($all_len > 0) {
                    for (let $i: number = 0; $i < $all_len; $i++) {
                        if (this._content[$i]._key == $key) {
                            return $i;
                        }
                    }
                }
            } else {
                let $left_point: number = 0, $right_point: number = $all_len - 1;
                let $mid_point: number = null;
                let $key_cell: K = null;
                while ($left_point <= $right_point) {
                    $mid_point = Math.floor(($left_point + $right_point) / 2);
                    $key_cell = this._content[$mid_point]._key;
                    if ($key_cell == $key) {
                        return $mid_point;
                    } else {
                        switch (this._type_sort) {
                            case TYPE_SORT.___ASC___:
                                if ($key_cell > $key) {
                                    $right_point = $mid_point - 1;
                                } else {
                                    $left_point = $mid_point + 1;
                                }
                                break;
                            case TYPE_SORT.___DES___:
                                if ($key_cell > $key) {
                                    $left_point = $mid_point + 1;
                                } else {
                                    $right_point = $mid_point - 1;
                                }
                                break;
                        }
                    }
                }
            }
            return -1;
        }

        /**
         * 是否存在此值
         * @param $value 值
         * @returns 是否存在
         */
        public containsValue($value: V): boolean {
            if (!this._content || this._content.length == 0) return false;
            const length: number = this._content.length;
            let $cell: IConten2MapHash<K, V> = null;
            for (let $i: number = 0; $i < length; $i++) {
                $cell = this._content[$i];
                if ($cell._value == $value) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 添加一个键值对
         * <b style="color:red">
         *     $is_cover只对key已经存在的情况下有效 , 如果为true则会覆盖key值对应的value值
         * </b>
         * @param  $key
         * @param  $value
         * @param $is_cover 当键存在时,是否覆盖值(default:false)
         * @returns  数据集长度
         */
        public add($key: K, $value: V, $is_cover: boolean = false): number {
            if (!$key) {
                console.warn("[HashMap]Cannot add a $value with undefined or null $key!");
                return this._content.length;
            }
            const $index: number = this.getKeyIndex($key);
            if ($index < 0) {
                if (!this._open_binarySearch || this._content.length == 0) {
                    this._content.push(
                        {
                            "_key": $key,
                            "_value": $value
                        }
                    );
                    //是否开启二分查找的赋值
                    if (this._open_binarySearch == null) {
                        if (typeof ($key) == "string" || typeof ($key) == "number") {
                            this._open_binarySearch = true;
                        } else {
                            this._open_binarySearch = false;
                        }
                    }
                } else {
                    if (this._content.length == 1) {
                        const $first_key: K = this._content[0]._key;
                        switch (this._type_sort) {
                            case TYPE_SORT.___ASC___:
                                if ($first_key > $key) {
                                    this._content.unshift(
                                        {
                                            "_key": $key,
                                            "_value": $value
                                        }
                                    );
                                } else {
                                    this._content.push(
                                        {
                                            "_key": $key,
                                            "_value": $value
                                        }
                                    );
                                }
                                break;
                            case TYPE_SORT.___DES___:
                                if ($first_key > $key) {
                                    this._content.push(
                                        {
                                            "_key": $key,
                                            "_value": $value
                                        }
                                    );
                                } else {
                                    this._content.unshift(
                                        {
                                            "_key": $key,
                                            "_value": $value
                                        }
                                    );
                                }
                                break;
                        }
                    } else {
                        //使用二分查找,找到数据的插入点(需要对比2边的数据)
                        const $all_len: number = this._content.length;
                        let $left_point: number = 0, $right_point: number = $all_len - 1;
                        let $mid_point: number = null;
                        let $key_cell: K = null;
                        let $left_key_cell: K = null, $right_key_cell: K = null;
                        let $is_done: boolean = false;
                        while ($left_point <= $right_point) {
                            $mid_point = Math.floor(($left_point + $right_point) / 2);
                            $key_cell = this._content[$mid_point]._key;
                            $left_key_cell = $mid_point - 1 >= 0 ? this._content[$mid_point - 1]._key : null;
                            $right_key_cell = $mid_point + 1 < $all_len ? this._content[$mid_point + 1]._key : null;
                            switch (this._type_sort) {
                                case TYPE_SORT.___ASC___:
                                    if ($key < $key_cell) {
                                        if (!$left_key_cell || $left_key_cell < $key) {
                                            this._content.splice(
                                                $mid_point,
                                                0,
                                                {
                                                    "_key": $key,
                                                    "_value": $value
                                                }
                                            );
                                            $is_done = true;
                                            break;
                                        }
                                        $right_point = $mid_point - 1;
                                    } else {
                                        if (!$right_key_cell || $key < $right_key_cell) {
                                            if ($mid_point == $all_len - 1) {
                                                this._content.push(
                                                    {
                                                        "_key": $key,
                                                        "_value": $value
                                                    }
                                                );
                                            } else {
                                                this._content.splice(
                                                    $mid_point + 1,
                                                    0,
                                                    {
                                                        "_key": $key,
                                                        "_value": $value
                                                    }
                                                );
                                            }
                                            $is_done = true;
                                            break;
                                        }
                                        $left_point = $mid_point + 1;
                                    }
                                    break;
                                case TYPE_SORT.___DES___:
                                    if ($key < $key_cell) {
                                        if (!$right_key_cell || $key > $right_key_cell) {
                                            if ($mid_point == $all_len - 1) {
                                                this._content.push(
                                                    {
                                                        "_key": $key,
                                                        "_value": $value
                                                    }
                                                );
                                            } else {
                                                this._content.splice(
                                                    $mid_point + 1,
                                                    0,
                                                    {
                                                        "_key": $key,
                                                        "_value": $value
                                                    }
                                                );
                                            }
                                            $is_done = true;
                                            break;
                                        }
                                        $left_point = $mid_point + 1;
                                    } else {
                                        if (!$left_key_cell || $left_key_cell > $key) {
                                            this._content.splice(
                                                $mid_point,
                                                0,
                                                {
                                                    "_key": $key,
                                                    "_value": $value
                                                }
                                            );
                                            $is_done = true;
                                            break;
                                        }
                                        $right_point = $mid_point - 1;
                                    }
                                    break;
                            }
                            if ($is_done) {
                                break;
                            }
                        }
                    }
                }
            } else {
                //是否需要更新数值
                if ($is_cover) {
                    this._content[$index]._value = $value;
                } else {
                    console.warn("[HashMap]The Key value already exists, but the corresponding data is not covered!");
                }
            }
            return this._content.length;
        }


        /**
         * 移除一个键值对,并返回值
         * @param $key
         * @returns 移除的值
         */
        public remove($key: K): V {
            const $index: number = this.getKeyIndex($key);
            if ($index < 0) {
                return null;
            }
            let $cell: IConten2MapHash<K, V> = this._content[$index];
            this._content.splice($index, 1);
            return $cell._value;
        }

        /**
         * 移除第一个键值对,并返回键值对
         * @returns 键值对
         */
        public shift(): IConten2MapHash<K, V> {
            if (this._content.length > 0) {
                let $cell: IConten2MapHash<K, V> = this._content.shift();
                return $cell;
            }
            return null;
        }

        /**
         * 移除最后一个键值对,并返回键值对
         * @returns 键值对
         */
        public pop(): IConten2MapHash<K, V> {
            if (this._content.length > 0) {
                let $cell: IConten2MapHash<K, V> = this._content.pop();
                return $cell;
            }
            return null;
        }


        /**
         * @inheritDoc
         */
        public clear($callback?: ($params?: any) => void, $params?: any): void {
            this._content.length = 0;
            $callback && $callback($params);
        }

        /**
         * 拷贝
         * @param $isDeep 是否为深度拷贝
         */
        public clone( $isDeep: boolean ): HashMap<K, V> {
            if( !$isDeep ){
                let hashMap: HashMap<K, V> = new HashMap<K, V>();
                hashMap._type_sort = this._type_sort;
                hashMap._open_binarySearch = this._open_binarySearch;
                let $cell: IConten2MapHash<K, V> = null;
                for (let $i: number = 0, $j: number = this._content.length; $i < $j; $i++) {
                    $cell = this._content[$i];
                    hashMap.add($cell._key, $cell._value);
                }
                return hashMap;
            }else{
                return DeepCopyTool.toDeepCopy<HashMap<K, V>>(this);
            }
        }

        /**
         * 数据集是否为空(只读)
         * @returns 是否为空集
         */
        public get isEmpty(): boolean {
            return this._content.length == 0;
        }

        /**
         * 键值对的个数(只读)
         * @returns 数据集个数
         */
        public get length(): number {
            return this._content.length;
        }

        /**
         * 获取键
         * @param $value
         */
        public getKey($value: V): K {
            let $cell: IConten2MapHash<K, V> = null;
            for (let $i: number = 0, $j: number = this._content.length; $i < $j; $i++) {
                $cell = this._content[$i];
                if ($cell._value == $value) {
                    return $cell._key;
                }
            }
            return null;
        }

        /**
         * 获取所有键S
         */
        public getKeys(): Array<K> {
            if (this._content.length == 0) return null;
            let $cell: IConten2MapHash<K, V> = null;
            let $keys: Array<K> = [];
            for (let $i: number = 0, $j: number = this._content.length; $i < $j; $i++) {
                $cell = this._content[$i];
                $keys.push($cell._key);
            }
            return $keys;
        }

        /**
         * 获取值
         * @param $key
         */
        public getValue($key: K): V {
            const $index: number = this.getKeyIndex($key);
            if ($index < 0) {
                return null;
            } else {
                return this._content[$index]._value;
            }
        }

        /**
         * 获取所有值S
         */
        public getValues(): Array<V> {
            if (this._content.length == 0) return null;
            let $cell: IConten2MapHash<K, V> = null;
            let $values: Array<V> = [];
            for (let $i: number = 0, $j: number = this._content.length; $i < $j; $i++) {
                $cell = this._content[$i];
                $values.push($cell._value);
            }
            return $values;
        }

        /**
         * 销毁
         * <b style="color:red">
         *    此方法会调用clear : 调用此方法之前没必要调用clear
         * </b>
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this.clear(null);
            this._content = null;
            $callback && $callback($params);
        }
    }

    /**
     * HashMap键值数据对接口
     * @author Aonaufly
     */
    export interface IConten2MapHash<K, V> {
        /**键*/
        _key: K;
        /**值*/
        _value: V;
    }

    /**
     * 排序枚举
     * @author Aonaufly
     */
    export enum TYPE_SORT {
        /**升序*/
        ___ASC___ = 1,
        /**降序*/
        ___DES___ = 2
    }
}
