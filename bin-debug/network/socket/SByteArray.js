var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var lib2egret;
(function (lib2egret) {
    var network;
    (function (network) {
        /**
         * Byte
         * @author Aonaufly
         */
        var SByteArray = (function (_super) {
            __extends(SByteArray, _super);
            function SByteArray() {
                var _this = _super.call(this) || this;
                _this.endian = network.SocketMgr.Instance.Endian;
                return _this;
            }
            SByteArray.prototype.reset = function () {
                this.position = this.length = 0;
            };
            /**
             * 读取字符串
             */
            SByteArray.prototype.readString = function () {
                var $len = this.readShort();
                return this.readUTFBytes($len);
            };
            /**
             * 写入字符串
             * @param $str
             */
            SByteArray.prototype.writeString = function ($str) {
                var $data = this["encodeUTF8"]($str);
                var $len = $data.length;
                this.writeShort($len);
                this.writeUTFBytes($str);
            };
            /**
             * 写入Uint64
             * @param bigInt
             */
            SByteArray.prototype.writeUint64 = function (bigInt) {
                this.writeUnsignedInt(bigInt._lowUint);
                this.writeUnsignedInt(bigInt._highUint);
            };
            /**
             * 读出Uint64
             */
            SByteArray.prototype.readUint64 = function () {
                var i64 = new network.Uint64(this);
                var str = i64.toString();
                return parseInt(str);
            };
            return SByteArray;
        }(egret.ByteArray));
        network.SByteArray = SByteArray;
        __reflect(SByteArray.prototype, "lib2egret.network.SByteArray");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
