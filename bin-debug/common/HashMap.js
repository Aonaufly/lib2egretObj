var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var common;
    (function (common) {
        /**
         * HashMap : Map关系映射数据集类
         * <b style="color:blue">K : 键  V : 值 , 本版可提供二分查找功能,相较于上一版查找性能有大幅提升(注意:使用二分查找需要事先排序)</b>
         * <b style="color:red">
         *     目前仅提供Key(键<K>)类型为 string , number的二分查找功能
         * </b>
         * @author Aonaufly
         */
        var HashMap = (function () {
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
            function HashMap($initData, $typeSort, $useBinarySearch, $needSort, $checkKey) {
                if ($initData === void 0) { $initData = null; }
                if ($typeSort === void 0) { $typeSort = TYPE_SORT.___ASC___; }
                if ($useBinarySearch === void 0) { $useBinarySearch = false; }
                if ($needSort === void 0) { $needSort = false; }
                if ($checkKey === void 0) { $checkKey = false; }
                var _this = this;
                this._type_sort = $typeSort;
                if (!$initData || $initData.length == 0) {
                    this._content = [];
                }
                else {
                    if ($checkKey) {
                        this.checkInitData2Unrepeat4Keys($initData);
                    }
                    if ($useBinarySearch) {
                        var $data_1 = $initData[0];
                        if (typeof ($data_1._key) == "string" || typeof ($data_1._key) == "number") {
                            this._open_binarySearch = true;
                            if ($needSort) {
                                //对$initData进行排序
                                $initData.sort(function ($a, $b) {
                                    var $a_key = $a._key;
                                    var $b_key = $b._key;
                                    switch (_this._type_sort) {
                                        case TYPE_SORT.___ASC___:
                                            if (typeof ($data_1._key) == "number") {
                                                return (+$a_key) - (+$b_key);
                                            }
                                            else {
                                                return _this.strCompare($a_key, $b_key);
                                            }
                                        case TYPE_SORT.___DES___:
                                            if (typeof ($data_1._key) == "number") {
                                                return (+$b_key) - (+$a_key);
                                            }
                                            else {
                                                return _this.strCompare($b_key, $a_key);
                                            }
                                    }
                                });
                            }
                        }
                        else {
                            this._open_binarySearch = false;
                        }
                        this._content = $initData;
                    }
                    else {
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
            HashMap.prototype.checkInitData2Unrepeat4Keys = function ($initData) {
                if ($initData.length == 1) {
                    return true;
                }
                var $cell_i = null;
                var $cell_n = null;
                for (var $i = 0, $j = $initData.length; $i < $j; $i++) {
                    $cell_i = $initData[$i];
                    for (var $n = $i + 1; $n < $j; $n++) {
                        $cell_n = $initData[$n];
                        if ($cell_n._key == $cell_i._key) {
                            console.error("\u521D\u59CB\u5316Key\u503C\u91CD\u590D : " + $cell_i._key);
                            return false;
                        }
                    }
                }
                return true;
            };
            /**
             * 重新设置根据Key的排序方式
             * @param $value 排序方案
             */
            HashMap.prototype.setType2Sort = function ($value) {
                if (this._type_sort != $value) {
                    this._type_sort = $value;
                    if (this._content.length > 1 && this._open_binarySearch) {
                        this._content = this._content.reverse();
                    }
                }
            };
            Object.defineProperty(HashMap.prototype, "type2Sort", {
                /**
                 * 获得本数据集的排序方式(只读)
                 */
                get: function () {
                    return this._type_sort;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 比较2个字符串的大小
             * @param $a
             * @param $b
             */
            HashMap.prototype.strCompare = function ($a, $b) {
                var $a_len = $a.length;
                var $b_len = $b.length;
                var $j = $a_len >= $b_len ? $a_len : $b_len;
                var $a_ascii = null, $b_ascii = null;
                for (var $i = 0; $i < $j; $i++) {
                    $a_ascii = $i < $a_len ? $a.charCodeAt($i) : -1;
                    $b_ascii = $i < $b_len ? $b.charCodeAt($i) : -1;
                    if ($a_ascii != $b_ascii) {
                        return $a_ascii - $b_ascii;
                    }
                }
            };
            /**
             * 是否存在此键
             * @param $key 键值
             * @returns 是否存在
             */
            HashMap.prototype.containsKey = function ($key) {
                if (!this._content || this._content.length == 0)
                    return false;
                return this.getKeyIndex($key) > -1;
            };
            /**
             * 获得Key所在的下标
             * <b style="color:red">
             *     若没找到,返回-1
             * </b>
             * @param $key
             * @returns number
             */
            HashMap.prototype.getKeyIndex = function ($key) {
                var $all_len = this._content.length;
                if (!this._open_binarySearch || $all_len <= 1) {
                    if ($all_len > 0) {
                        for (var $i = 0; $i < $all_len; $i++) {
                            if (this._content[$i]._key == $key) {
                                return $i;
                            }
                        }
                    }
                }
                else {
                    var $left_point = 0, $right_point = $all_len - 1;
                    var $mid_point = null;
                    var $key_cell = null;
                    while ($left_point <= $right_point) {
                        $mid_point = Math.floor(($left_point + $right_point) / 2);
                        $key_cell = this._content[$mid_point]._key;
                        if ($key_cell == $key) {
                            return $mid_point;
                        }
                        else {
                            switch (this._type_sort) {
                                case TYPE_SORT.___ASC___:
                                    if ($key_cell > $key) {
                                        $right_point = $mid_point - 1;
                                    }
                                    else {
                                        $left_point = $mid_point + 1;
                                    }
                                    break;
                                case TYPE_SORT.___DES___:
                                    if ($key_cell > $key) {
                                        $left_point = $mid_point + 1;
                                    }
                                    else {
                                        $right_point = $mid_point - 1;
                                    }
                                    break;
                            }
                        }
                    }
                }
                return -1;
            };
            /**
             * 是否存在此值
             * @param $value 值
             * @returns 是否存在
             */
            HashMap.prototype.containsValue = function ($value) {
                if (!this._content || this._content.length == 0)
                    return false;
                var length = this._content.length;
                var $cell = null;
                for (var $i = 0; $i < length; $i++) {
                    $cell = this._content[$i];
                    if ($cell._value == $value) {
                        return true;
                    }
                }
                return false;
            };
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
            HashMap.prototype.add = function ($key, $value, $is_cover) {
                if ($is_cover === void 0) { $is_cover = false; }
                if (!$key) {
                    console.warn("[HashMap]Cannot add a $value with undefined or null $key!");
                    return this._content.length;
                }
                var $index = this.getKeyIndex($key);
                if ($index < 0) {
                    if (!this._open_binarySearch || this._content.length == 0) {
                        this._content.push({
                            "_key": $key,
                            "_value": $value
                        });
                        //是否开启二分查找的赋值
                        if (this._open_binarySearch == null) {
                            if (typeof ($key) == "string" || typeof ($key) == "number") {
                                this._open_binarySearch = true;
                            }
                            else {
                                this._open_binarySearch = false;
                            }
                        }
                    }
                    else {
                        if (this._content.length == 1) {
                            var $first_key = this._content[0]._key;
                            switch (this._type_sort) {
                                case TYPE_SORT.___ASC___:
                                    if ($first_key > $key) {
                                        this._content.unshift({
                                            "_key": $key,
                                            "_value": $value
                                        });
                                    }
                                    else {
                                        this._content.push({
                                            "_key": $key,
                                            "_value": $value
                                        });
                                    }
                                    break;
                                case TYPE_SORT.___DES___:
                                    if ($first_key > $key) {
                                        this._content.push({
                                            "_key": $key,
                                            "_value": $value
                                        });
                                    }
                                    else {
                                        this._content.unshift({
                                            "_key": $key,
                                            "_value": $value
                                        });
                                    }
                                    break;
                            }
                        }
                        else {
                            //使用二分查找,找到数据的插入点(需要对比2边的数据)
                            var $all_len = this._content.length;
                            var $left_point = 0, $right_point = $all_len - 1;
                            var $mid_point = null;
                            var $key_cell = null;
                            var $left_key_cell = null, $right_key_cell = null;
                            var $is_done = false;
                            while ($left_point <= $right_point) {
                                $mid_point = Math.floor(($left_point + $right_point) / 2);
                                $key_cell = this._content[$mid_point]._key;
                                $left_key_cell = $mid_point - 1 >= 0 ? this._content[$mid_point - 1]._key : null;
                                $right_key_cell = $mid_point + 1 < $all_len ? this._content[$mid_point + 1]._key : null;
                                switch (this._type_sort) {
                                    case TYPE_SORT.___ASC___:
                                        if ($key < $key_cell) {
                                            if (!$left_key_cell || $left_key_cell < $key) {
                                                this._content.splice($mid_point, 0, {
                                                    "_key": $key,
                                                    "_value": $value
                                                });
                                                $is_done = true;
                                                break;
                                            }
                                            $right_point = $mid_point - 1;
                                        }
                                        else {
                                            if (!$right_key_cell || $key < $right_key_cell) {
                                                if ($mid_point == $all_len - 1) {
                                                    this._content.push({
                                                        "_key": $key,
                                                        "_value": $value
                                                    });
                                                }
                                                else {
                                                    this._content.splice($mid_point + 1, 0, {
                                                        "_key": $key,
                                                        "_value": $value
                                                    });
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
                                                    this._content.push({
                                                        "_key": $key,
                                                        "_value": $value
                                                    });
                                                }
                                                else {
                                                    this._content.splice($mid_point + 1, 0, {
                                                        "_key": $key,
                                                        "_value": $value
                                                    });
                                                }
                                                $is_done = true;
                                                break;
                                            }
                                            $left_point = $mid_point + 1;
                                        }
                                        else {
                                            if (!$left_key_cell || $left_key_cell > $key) {
                                                this._content.splice($mid_point, 0, {
                                                    "_key": $key,
                                                    "_value": $value
                                                });
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
                }
                else {
                    //是否需要更新数值
                    if ($is_cover) {
                        this._content[$index]._value = $value;
                    }
                    else {
                        console.warn("[HashMap]The Key value already exists, but the corresponding data is not covered!");
                    }
                }
                return this._content.length;
            };
            /**
             * 移除一个键值对,并返回值
             * @param $key
             * @returns 移除的值
             */
            HashMap.prototype.remove = function ($key) {
                var $index = this.getKeyIndex($key);
                if ($index < 0) {
                    return null;
                }
                var $cell = this._content[$index];
                this._content.splice($index, 1);
                return $cell._value;
            };
            /**
             * 移除第一个键值对,并返回键值对
             * @returns 键值对
             */
            HashMap.prototype.shift = function () {
                if (this._content.length > 0) {
                    var $cell = this._content.shift();
                    return $cell;
                }
                return null;
            };
            /**
             * 移除最后一个键值对,并返回键值对
             * @returns 键值对
             */
            HashMap.prototype.pop = function () {
                if (this._content.length > 0) {
                    var $cell = this._content.pop();
                    return $cell;
                }
                return null;
            };
            /**
             * @inheritDoc
             */
            HashMap.prototype.clear = function ($callback, $params) {
                this._content.length = 0;
                $callback && $callback($params);
            };
            /**
             * 拷贝
             * @param $isDeep 是否为深度拷贝
             */
            HashMap.prototype.clone = function ($isDeep) {
                if (!$isDeep) {
                    var hashMap = new HashMap();
                    hashMap._type_sort = this._type_sort;
                    hashMap._open_binarySearch = this._open_binarySearch;
                    var $cell = null;
                    for (var $i = 0, $j = this._content.length; $i < $j; $i++) {
                        $cell = this._content[$i];
                        hashMap.add($cell._key, $cell._value);
                    }
                    return hashMap;
                }
                else {
                    return common.DeepCopyTool.toDeepCopy(this);
                }
            };
            Object.defineProperty(HashMap.prototype, "isEmpty", {
                /**
                 * 数据集是否为空(只读)
                 * @returns 是否为空集
                 */
                get: function () {
                    return this._content.length == 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HashMap.prototype, "length", {
                /**
                 * 键值对的个数(只读)
                 * @returns 数据集个数
                 */
                get: function () {
                    return this._content.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取键
             * @param $value
             */
            HashMap.prototype.getKey = function ($value) {
                var $cell = null;
                for (var $i = 0, $j = this._content.length; $i < $j; $i++) {
                    $cell = this._content[$i];
                    if ($cell._value == $value) {
                        return $cell._key;
                    }
                }
                return null;
            };
            /**
             * 获取所有键S
             */
            HashMap.prototype.getKeys = function () {
                if (this._content.length == 0)
                    return null;
                var $cell = null;
                var $keys = [];
                for (var $i = 0, $j = this._content.length; $i < $j; $i++) {
                    $cell = this._content[$i];
                    $keys.push($cell._key);
                }
                return $keys;
            };
            /**
             * 获取值
             * @param $key
             */
            HashMap.prototype.getValue = function ($key) {
                var $index = this.getKeyIndex($key);
                if ($index < 0) {
                    return null;
                }
                else {
                    return this._content[$index]._value;
                }
            };
            /**
             * 获取所有值S
             */
            HashMap.prototype.getValues = function () {
                if (this._content.length == 0)
                    return null;
                var $cell = null;
                var $values = [];
                for (var $i = 0, $j = this._content.length; $i < $j; $i++) {
                    $cell = this._content[$i];
                    $values.push($cell._value);
                }
                return $values;
            };
            /**
             * 销毁
             * <b style="color:red">
             *    此方法会调用clear : 调用此方法之前没必要调用clear
             * </b>
             */
            HashMap.prototype.destroy = function ($callback, $params) {
                this.clear(null);
                this._content = null;
                $callback && $callback($params);
            };
            return HashMap;
        }());
        common.HashMap = HashMap;
        __reflect(HashMap.prototype, "lib2egret.common.HashMap", ["lib2egret.common.IDestroy"]);
        /**
         * 排序枚举
         * @author Aonaufly
         */
        var TYPE_SORT;
        (function (TYPE_SORT) {
            /**升序*/
            TYPE_SORT[TYPE_SORT["___ASC___"] = 1] = "___ASC___";
            /**降序*/
            TYPE_SORT[TYPE_SORT["___DES___"] = 2] = "___DES___";
        })(TYPE_SORT = common.TYPE_SORT || (common.TYPE_SORT = {}));
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
