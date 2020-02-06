module lib2egret.network {
    /**
     * Byte
     * @author Aonaufly
     */
    export class SByteArray extends egret.ByteArray {

        public constructor() {
            super();
            this.endian = SocketMgr.Instance.Endian;
        }

        public reset(): void {
            this.position = this.length = 0;
        }

        /**
         * 读取字符串
         */
        public readString(): string {
            const $len: number = this.readShort();
            return this.readUTFBytes($len);
        }

        /**
         * 写入字符串
         * @param $str
         */
        public writeString($str: string): void {
            const $data: Uint8Array = this["encodeUTF8"]($str) as Uint8Array;
            const $len: number = $data.length;
            this.writeShort($len);
            this.writeUTFBytes($str);
        }

        /**
         * 写入Uint64
         * @param bigInt
         */
        public writeUint64(bigInt: Uint64): void {
            this.writeUnsignedInt(bigInt._lowUint);
            this.writeUnsignedInt(bigInt._highUint);
        }

        /**
         * 读出Uint64
         */
        public readUint64(): number {
            let i64: Uint64 = new Uint64(this);
            let str: string = i64.toString();
            return parseInt(str);
        }

    }
}
