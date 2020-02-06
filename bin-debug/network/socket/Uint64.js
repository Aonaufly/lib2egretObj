var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var network;
    (function (network) {
        var Uint64 = (function () {
            function Uint64(v) {
                var _this = this;
                this._lowUint = 0;
                this._highUint = 0;
                this.isGreaterThanOrEqual = function (target) {
                    if (target instanceof Uint64)
                        return _this._highUint > target._highUint || (_this._highUint == target._highUint && _this._lowUint >= target._lowUint);
                    else {
                        var u64 = new Uint64();
                        if (typeof target == 'string') {
                            u64.value = target;
                            return _this.isGreaterThanOrEqual(u64);
                        }
                        if (typeof target == 'number') {
                            u64.value = target.toString();
                            return _this.isGreaterThanOrEqual(u64);
                        }
                    }
                };
                this.value = v;
            }
            Uint64.prototype.isEqual = function (target) {
                if (!target)
                    return false;
                return this._lowUint == target._lowUint && this._highUint == target._highUint;
            };
            Uint64.prototype.isGreaterThan = function (target) {
                if (target instanceof Uint64)
                    return this._highUint > target._highUint || (this._highUint == target._highUint && this._lowUint > target._lowUint);
                else {
                    var u64 = new Uint64();
                    if (typeof target == 'string') {
                        u64.value = target;
                        return this.isGreaterThanOrEqual(u64);
                    }
                    if (typeof target == 'number') {
                        u64.value = target.toString();
                        return this.isGreaterThanOrEqual(u64);
                    }
                }
            };
            Object.defineProperty(Uint64.prototype, "isZero", {
                get: function () {
                    return this._lowUint == 0 && this._highUint == 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Uint64.prototype, "isGreaterThanZero", {
                /** 是否大于0 */
                get: function () {
                    return this._lowUint > 0 || this._highUint > 0;
                },
                enumerable: true,
                configurable: true
            });
            Uint64.prototype.writeByte = function (b) {
                b.writeUnsignedInt(this._lowUint);
                b.writeUnsignedInt(this._highUint);
            };
            Uint64.prototype.setValue = function (lowerUint, higherUint) {
                if (lowerUint === void 0) { lowerUint = 0; }
                if (higherUint === void 0) { higherUint = 0; }
                this._lowUint = lowerUint;
                this._highUint = higherUint;
            };
            Object.defineProperty(Uint64.prototype, "value", {
                set: function (v) {
                    if (v instanceof egret.ByteArray) {
                        this._lowUint = v.readUnsignedInt();
                        this._highUint = v.readUnsignedInt();
                    }
                    else if (typeof v == 'string') {
                        Uint64.stringToUint64(v, 10, this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Uint64.prototype, "valueByString", {
                set: function (value) {
                    var num = 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 左移运算
             * @param num
             * @return
             */
            Uint64.prototype.leftMove = function (num, result) {
                if (result === void 0) { result = null; }
                result = result || this;
                var bitMask = Uint64.LeftMoveMask[num];
                var lowUintMaskNum = bitMask & this._lowUint;
                lowUintMaskNum = lowUintMaskNum >>> (32 - num);
                result._lowUint = this._lowUint << num;
                result._highUint = this._highUint << num;
                result._highUint = result._highUint | lowUintMaskNum;
            };
            /**
             *加法
             * @param value
             * @param result
             */
            Uint64.prototype.add = function (value, result) {
                if (result === void 0) { result = null; }
                result = result || this;
                var num = this._lowUint + value._lowUint;
                result._highUint = this._highUint + value._highUint;
                if (num >= Uint64.MaxLowUint) {
                    result._highUint++;
                    result._lowUint = num - Uint64.MaxLowUint;
                }
                else {
                    result._lowUint = num;
                }
            };
            /** 减法 */
            Uint64.prototype.subtraction = function (value, result) {
                if (result === void 0) { result = null; }
                result = result || this;
                var num = this._lowUint - value._lowUint;
                result._highUint = this._highUint - value._highUint;
                if (num < 0) {
                    result._highUint--;
                    result._lowUint = num + Uint64.MaxLowUint;
                }
                else {
                    result._lowUint = num;
                }
            };
            /**
             * @param value
             * 注意value值不可过大，否则会计算错误
             */
            Uint64.prototype.scale = function (value, result) {
                if (result === void 0) { result = null; }
                result = result || this;
                var num = this._lowUint * value;
                result._highUint = this._highUint * value;
                result._highUint += Math.floor(Math.abs(num / Uint64.MaxLowUint));
                result._lowUint = num % Uint64.MaxLowUint;
            };
            Uint64.prototype.toString = function (radix) {
                if (radix === void 0) { radix = 10; }
                var result = "";
                var lowUint = this._lowUint;
                var highUint = this._highUint;
                var highRemain;
                var lowRemain;
                var tempNum;
                while (highUint != 0 || lowUint != 0) {
                    highRemain = (highUint % radix);
                    tempNum = highRemain * Uint64.MaxLowUint + lowUint;
                    lowRemain = tempNum % radix;
                    result = lowRemain + result;
                    highUint = (highUint - highRemain) / radix;
                    lowUint = (tempNum - lowRemain) / radix;
                }
                return result.length ? result : "0";
            };
            /**
             *根据字符串导出成64位数据结构
             * @param value
             * @return
             */
            Uint64.stringToUint64 = function (value, radix, result) {
                if (radix === void 0) { radix = 10; }
                if (result === void 0) { result = null; }
                result = result || new Uint64;
                var lowUint = 0;
                var highUint = 0;
                var tempNum;
                var len = value.length;
                var char;
                for (var i = 0; i < len; i++) {
                    char = parseInt(value.charAt(i));
                    tempNum = lowUint * radix + char;
                    highUint = highUint * radix + Math.floor(tempNum / Uint64.MaxLowUint);
                    lowUint = tempNum % Uint64.MaxLowUint;
                }
                result.setValue(lowUint, highUint);
                return result;
            };
            Uint64.LeftMoveMask = [0,
                0x80000000, 0x40000000, 0x20000000, 0x10000000,
                0x08000000, 0x04000000, 0x02000000, 0x01000000,
                0x00800000, 0x00400000, 0x00200000, 0x00100000,
                0x00080000, 0x00040000, 0x00020000, 0x00010000,
                0x00008000, 0x00004000, 0x00002000, 0x00001000,
                0x00000800, 0x00000400, 0x00000200, 0x00000100,
                0x00000080, 0x00000040, 0x00000020, 0x00000010,
                0x00000008, 0x00000004, 0x00000002, 0x00000001,
            ];
            Uint64.MaxLowUint = 0xffffffff + 1;
            return Uint64;
        }());
        network.Uint64 = Uint64;
        __reflect(Uint64.prototype, "lib2egret.network.Uint64");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
