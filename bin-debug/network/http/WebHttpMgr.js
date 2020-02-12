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
         * Http管理器
         * <b style="color:red">
         *     HTTP通讯
         * </b>
         * @author Aonaufly
         */
        var WebHttpMgr = (function (_super) {
            __extends(WebHttpMgr, _super);
            /**
             * 防止类外实例化
             */
            function WebHttpMgr() {
                var _this = _super.call(this) || this;
                _this._crypto = null;
                _this._store_max = 8;
                _this._pool_http = new lib2egret.common.Pool2Obj(_this._store_max);
                return _this;
            }
            Object.defineProperty(WebHttpMgr, "Instance", {
                /**
                 * 获取单例对象句柄
                 */
                get: function () {
                    if (!WebHttpMgr._instance) {
                        WebHttpMgr._instance = new WebHttpMgr();
                    }
                    return WebHttpMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 设置加密程序
             */
            WebHttpMgr.prototype.setCrypto = function ($data) {
                this._crypto = $data;
            };
            /**
             * 设置对象池的最大存储量
             * <b style="color:red">
             *     可以同步请求的Http数量
             *     默认存储量 : 8
             * </b>
             * @param $max_store
             */
            WebHttpMgr.prototype.setMaxStore = function ($max_store) {
                if ($max_store === void 0) { $max_store = 10; }
                if ($max_store && $max_store >= 1 && $max_store != this._store_max) {
                    this._store_max = $max_store;
                    this._pool_http.reset2MaxStorage($max_store);
                }
            };
            /**
             * 开始HTTP请求
             * <b style="color:red">
             *     提供了HTTP跨域请求的功能
             * </b>
             * @param $tag 标签
             * @param $url 地址
             * @param $sendercallback 回调函数
             * @param $param 参数 <b style="color:red"> 如 const $data : Object = {user_name: this._infoUser.nickName}</b>(默认:null)
             * @param $useCrypto 是否使用加/解密算法
             * @param $isGet 是否为GET模式(默认:true)
             * @param $isTry 请求失败是否尝试重新请求(默认:true)
             * @param $try_count <b style="color:red"> null/≤0 : 使用默认值( 默认 : 3 )</b>
             * @param $try_time <b style="color:red">秒 null/≤0 : 使用默认值( 默认 : 0.15 ) </b>
             * @param $isTextContent <b style="color:blue">是否为文本 , 如果不是, 则为二进制ArrayBuffer(默认 : true)</b>
             */
            WebHttpMgr.prototype.send = function ($tag, $url, $sendercallback, $param, $useCrypto, $isGet, $isTry, $try_count, $try_time, $isTextContent) {
                if ($param === void 0) { $param = null; }
                if ($useCrypto === void 0) { $useCrypto = false; }
                if ($isGet === void 0) { $isGet = true; }
                if ($isTry === void 0) { $isTry = true; }
                if ($try_count === void 0) { $try_count = null; }
                if ($try_time === void 0) { $try_time = null; }
                if ($isTextContent === void 0) { $isTextContent = true; }
                var $http = this._pool_http.Cell;
                if (!$http) {
                    $http = new network.WebHttp(this.callback.bind(this));
                }
                $http.start($tag, $url, $sendercallback, $param, $useCrypto ? this._crypto : null, $isGet, $isTry, $try_count, $try_time, $isTextContent);
            };
            /**
             * WebHttp的回调处理函数
             */
            WebHttpMgr.prototype.callback = function ($data) {
                switch ($data._type) {
                    case network.TYPE_HTTP_CALLBACK._COMPLETE:
                        $data._target.senderCallback($data._tag, $data._type, $data._complete);
                        break;
                    case network.TYPE_HTTP_CALLBACK._ERROR:
                        $data._target.senderCallback($data._tag, $data._type, null);
                        break;
                }
                //放入池子, 下回使用缓存
                this.put2Pool($data);
            };
            /**
             * 放入池子
             */
            WebHttpMgr.prototype.put2Pool = function ($data) {
                if (this._pool_http) {
                    if (!this._pool_http.put($data._target)) {
                        $data._target.destroy();
                    }
                }
                else {
                    $data._target.destroy();
                }
            };
            return WebHttpMgr;
        }(lib2egret.common.BaseSingle));
        network.WebHttpMgr = WebHttpMgr;
        __reflect(WebHttpMgr.prototype, "lib2egret.network.WebHttpMgr");
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
