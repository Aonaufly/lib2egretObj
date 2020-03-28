module lib2egret.network {
    /**
     * 加/解密
     * @author Aonaufly
     */
    export interface ICrypto {
        /**
         * 加密
         * @param $data
         */
        encryp($data: string | egret.ByteArray): string | egret.ByteArray;

        /**
         * 解密
         * @param $data
         */
        decrypt($data: string | egret.ByteArray): string | egret.ByteArray;
    }
}
