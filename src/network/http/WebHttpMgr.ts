module lib2egret.network {
    /**
     * Http管理器
     * <b style="color:red">
     *     HTTP通讯
     * </b>
     * @author Aonaufly
     */
    export class WebHttpMgr extends common.BaseSingle {
        private _crypto: ICrypto = null;
        /**
         * 获取单例对象句柄
         */
        public static get Instance(): WebHttpMgr {
            if (!WebHttpMgr._instance) {
                WebHttpMgr._instance = new WebHttpMgr();
            }
            return WebHttpMgr._instance as WebHttpMgr;
        }
        private _pool_http: common.Pool2Obj<WebHttp>;
        private _store_max: number = 8;
        public setCrypto($data: ICrypto): void {
            this._crypto = $data;
        }
        /**
         * 防止类外实例化
         */
        private constructor() {
            super();
            this._pool_http = new common.Pool2Obj<WebHttp>(this._store_max);
        }

        /**
         * 设置对象池的最大存储量
         * <b style="color:red">
         *     可以同步请求的Http数量
         *     默认存储量 : 8
         * </b>
         * @param $max_store
         */
        public setMaxStore($max_store: number = 10): void {
            if ($max_store && $max_store >= 1 && $max_store != this._store_max) {
                this._store_max = $max_store;
                this._pool_http.reset2MaxStorage($max_store);
            }
        }

        /**
         * 开始HTTP请求
         * <b style="color:red">
         *     提供了HTTP跨域请求的功能
         * </b>
         * @param $url 地址
         * @param $callback 回调函数
         * @param $param 参数 <b style="color:red"> 如 const $data : Object = {user_name: this._infoUser.nickName}</b>(默认:null)
         * @param $useCrypto 是否使用加/解密算法
         * @param $isGet 是否为GET模式(默认:true)
         * @param $isTry 请求失败是否尝试重新请求(默认:true)
         * @param $try_count <b style="color:red"> null/≤0 : 使用默认值( 默认 : 3 )</b>
         * @param $try_time <b style="color:red">秒 null/≤0 : 使用默认值( 默认 : 0.15 ) </b>
         * @param $isTextContent <b style="color:blue">是否为文本 , 如果不是, 则为二进制ArrayBuffer(默认 : true)</b>
         */
        public send(
            $tag: string,
            $url: string,
            $callback: ($tag: string, $type: TYPE_HTTP_CALLBACK, $data?: string | ArrayBuffer) => void,
            $param: object = null,
            $useCrypto: boolean = false,
            $isGet: boolean = true,
            $isTry: boolean = true,
            $try_count: number = null,
            $try_time: number = null,
            $isTextContent: boolean = true
        ): void {
            let $http: WebHttp = this._pool_http.Cell;
            if (!$http) {
                $http = new WebHttp(this.callback.bind(this));
            }
            $http.start($tag, $url, $callback, $param, $useCrypto ? this._crypto : null, $isGet, $isTry, $try_count, $try_time, $isTextContent);
        }

        /**
         * WebHttp的回调处理函数
         */
        private callback($data: IHttpCallBackModel): void {
            switch ($data._type) {
                case TYPE_HTTP_CALLBACK._COMPLETE:
                    $data._target.senderCallback($data._tag, $data._type, $data._complete);
                    break;
                case TYPE_HTTP_CALLBACK._ERROR:
                    $data._target.senderCallback($data._tag, $data._type, null);
                    break;
            }
            //放入池子, 下回使用缓存
            this.put2Pool($data);
        }
        /**
         * 放入池子
         */
        private put2Pool($data: IHttpCallBackModel): void {
            if (this._pool_http) {
                if (!this._pool_http.put($data._target)) {
                    $data._target.destroy();
                }
            } else {
                $data._target.destroy();
            }
        }
    }
}
