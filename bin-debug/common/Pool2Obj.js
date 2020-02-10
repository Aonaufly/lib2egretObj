var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var common;
    (function (common) {
        /**
         * 对象池类  => T : 需要存储的数据类型
         * <b style="color:green">可以理解为缓存(cache)类,为对象的复用提供解决方案</b>
         * @author Aonaufly
         */
        var Pool2Obj = (function () {
            /**
             * @param $maxStorage : 最多存储的数量(default:5)
             */
            function Pool2Obj($maxStorage) {
                if ($maxStorage === void 0) { $maxStorage = 5; }
                this._maxStorage = 5;
                this._storageArr = null;
                if ($maxStorage < 1) {
                    $maxStorage = 1;
                }
                this._maxStorage = $maxStorage;
                this._storageArr = [];
            }
            /**
             * 重新设置池子的最大容量
             * <b style="color:red">注意:当重设置与原值相等或者重设置≤0时,不进行重设操作</b>
             * @param $max 池子的缓存数量( 需要 > 0 )
             */
            Pool2Obj.prototype.reset2MaxStorage = function ($max) {
                if (this._maxStorage != $max && $max > 0) {
                    if ($max > this._maxStorage) {
                        //增加池子容量
                        this._maxStorage = $max;
                    }
                    else {
                        //缩减池子容量
                        if (this._storageArr.length > $max) {
                            var $i = 0;
                            while ($i < this._storageArr.length) {
                                this._storageArr.splice($i, 1);
                            }
                            this._maxStorage = $max;
                        }
                        else {
                            this._maxStorage = $max;
                        }
                    }
                }
            };
            Object.defineProperty(Pool2Obj.prototype, "Cell", {
                /**
                 * 获得一个Cell , 如果没有返回null
                 */
                get: function () {
                    if (this._storageArr.length == 0) {
                        return null;
                    }
                    else {
                        this._storageArr.shift();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 加入一个新的值cell
             * <b style="color:red">如果存储已满或$value == null,则不加入返回false</b>
             * @returns 是否加入成功
             */
            Pool2Obj.prototype.addNew = function ($value) {
                if (!$value)
                    return false;
                if (this._storageArr.length >= this._maxStorage)
                    return false;
                this._storageArr.push($value);
                return true;
            };
            /**
             * 放回对象池
             * <b style="color:red">放入失败<返回false>: ,池子已满</b>
             * @returns 是否放入成功
             */
            Pool2Obj.prototype.put = function ($value) {
                if (!$value)
                    return false;
                if (this._storageArr.length < this._maxStorage) {
                    this._storageArr.push($value);
                    return true;
                }
                return false;
            };
            Object.defineProperty(Pool2Obj.prototype, "cellList", {
                /**
                 * 获取对象池所有的数据列表(只读)
                 */
                get: function () {
                    if (!this._storageArr || this._storageArr.length == 0)
                        return null;
                    return this._storageArr;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 是否存在Cell
             * @param $cell
             * @returns 是否存在
             */
            Pool2Obj.prototype.containsValue = function ($cell) {
                if (!this._storageArr || this._storageArr.length == 0 || !$cell)
                    return false;
                var $cellT = null;
                for (var i = 0, j = this._storageArr.length; i < j; i++) {
                    $cellT = this._storageArr[i];
                    if ($cell == $cellT) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * @inheritDoc
             */
            Pool2Obj.prototype.clear = function ($callback, $params) {
                this._storageArr.length = 0;
                $callback && $callback($params);
            };
            /**
             * 销毁
             * <b style="color:red">
             *    此方法会调用clear : 调用此方法之前没必要调用clear
             * </b>
             */
            Pool2Obj.prototype.destroy = function ($callback, $params) {
                this.clear(null);
                this._storageArr = null;
                $callback && $callback($params);
            };
            return Pool2Obj;
        }());
        common.Pool2Obj = Pool2Obj;
        __reflect(Pool2Obj.prototype, "lib2egret.common.Pool2Obj", ["lib2egret.common.IDestroy"]);
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
