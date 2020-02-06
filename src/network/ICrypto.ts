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
        encryp($data: egret.ByteArray | Object): string;

        /**
         * 解密
         * @param $data
         */
        decrypt($data: egret.ByteArray | string): string;
    }
}
