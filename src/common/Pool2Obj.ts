module lib2egret.common {
    /**
     * 对象池类  => T : 需要存储的数据类型
     * <b style="color:green">可以理解为缓存(cache)类,为对象的复用提供解决方案</b>
     * @author Aonaufly
     */
    export class Pool2Obj<T> implements IDestroy {
        private _maxStorage: number = 5;
        private _storageArr: Array<T> = null;
        /**
         * @param {number} $maxStorage : 最多存储的数量(默认5个)
         */
        public constructor($maxStorage: number = 5) {
            if ($maxStorage < 1) {
                $maxStorage = 1;
            }
            this._maxStorage = $maxStorage;
            this._storageArr = [];
        }

        /**
         * 重新设置池子的最大容量
         * <b style="color:red">注意:当重设置与原值相等或者重设置≤0时,不进行重设操作</b>
         * @param {number} $max 池子的缓存数量( 需要 > 0 )
         */
        public reset2MaxStorage($max: number): void {
            if (this._maxStorage != $max && $max > 0) {
                if ($max > this._maxStorage) {
                    //增加池子容量
                    this._maxStorage = $max;
                } else {
                    //缩减池子容量
                    if (this._storageArr.length > $max) {
                        let $i: number = 0;
                        while ($i < this._storageArr.length) {
                            this._storageArr.splice($i, 1);
                        }
                        this._maxStorage = $max;
                    } else {
                        this._maxStorage = $max;
                    }
                }
            }
        }

        /**
         * 获得一个空闲的Cell , 如果没有返回null
         * <b style="color:red">注意:当得到值≠null时,此值已经被设为非free状态,用完之后需要放入池子中,以便下次复用</b>
         * @returns {T}
         * @constructor
         */
        public get Cell(): T {
            if (this._storageArr.length == 0) {
                return null;
            } else {
                this._storageArr.shift();
            }
        }

        /**
         * 加入一个新的值cell
         * <b style="color:red">如果存储已满或$value == null,则不加入返回false</b>
         * @param {T} $value cell
         * @returns {Boolean} 是否加入成功
         */
        public addNew($value: T): Boolean {
            if (!$value) return false;
            if (this._storageArr.length >= this._maxStorage) return false;
            this._storageArr.push(
                $value
            );
            return true;
        }

        /**
         * 重新放回对象池
         * <b style="color:red">放入失败<返回false>: ①,池子已满(Do-将此值从池子中删除);②,没有在池子中找到此值</b>
         * @param {T} $value
         * @returns {Boolean} 是否放入成功
         */
        public put($value: T): Boolean {
            if (!$value) return false;
            if (this._storageArr.length < this._maxStorage) {
                this._storageArr.push($value);
                return true;
            }
            return false;
        }

        /**
         * 获取对象池所有的数据列表(只读)
         */
        public get cellList(): Array<T> {
            if (!this._storageArr || this._storageArr.length == 0) return null;
            return this._storageArr;
        }

        /**
         * 是否存在Cell
         * @param {T} $cell
         * @returns {Boolean}
         */
        public containsValue($cell: T): Boolean {
            if (!this._storageArr || this._storageArr.length == 0 || !$cell) return false;
            let $cellT: T = null;
            for (let i: number = 0, j: number = this._storageArr.length; i < j; i++) {
                $cellT = this._storageArr[i];
                if ($cell == $cellT) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 清除所有Cell
         * @param {() => void} $callback 回调函数(默认:null)
         */
        public clear($callback?: ($params?: any) => void, $params?: any): void {
            this._storageArr.length = 0;
            if ($callback) {
                $callback($params);
            }
        }

        /**
         * 销毁
         * <b style="color:red">
         *    此方法会调用clear : 调用此方法之前没必要调用clear
         * </b>
         * @param {() => void} $callback 回调函数(默认:null)
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this.clear(null);
            this._storageArr = null;
            if ($callback) {
                $callback($params);
            }
        }
    }
}
