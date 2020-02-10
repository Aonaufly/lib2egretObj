var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var network;
    (function (network) {
        /**
         * webHttp的通讯模块
         * @author Aonaufly
         */
        var WebHttp = (function () {
            /**
             * @param $callback 回调函数
             */
            function WebHttp($callback) {
                var _this = this;
                this._try = 3;
                this._try_time = 0.15;
                this._cur_try = null;
                this._cur_time = null;
                this._http = null;
                this._try_count = 0;
                this._url = null;
                this._openUrl = null;
                this._param = null;
                this._isGet = true;
                this._isTry = true;
                this._try_timeout_id = 0;
                this._sender = null;
                this._crypto = null;
                this.onHttpComplete = function ($e) {
                    if ($e.currentTarget == _this._http) {
                        _this.handlerListener(false);
                        var $response = _this._http.response;
                        if (_this._crypto) {
                            $response = _this._crypto.decrypt($response);
                        }
                        _this._callback({
                            _tag: _this._tag,
                            _target: _this,
                            _type: TYPE_HTTP_CALLBACK._COMPLETE,
                            _complete: $response
                        });
                    }
                };
                this.onHttpError = function ($e) {
                    if ($e.currentTarget == _this._http) {
                        if (_this._isTry) {
                            _this._try_count++;
                            if (_this._try_count >= _this._cur_try) {
                                //报错
                                egret.warn((_this._isGet ? "GET" : "POST") + " :: " + $e);
                                _this.handlerListener(false);
                                _this._callback({
                                    _tag: _this._tag,
                                    _target: _this,
                                    _type: TYPE_HTTP_CALLBACK._ERROR
                                });
                            }
                            else {
                                //处理重试
                                _this.handler2try();
                            }
                        }
                        else {
                            //报错
                            egret.warn((_this._isGet ? "GET" : "POST") + " :: " + $e);
                            _this.handlerListener(false);
                            _this._callback({
                                _tag: _this._tag,
                                _target: _this,
                                _type: TYPE_HTTP_CALLBACK._ERROR
                            });
                        }
                    }
                };
                this.handler2try = function () {
                    if (_this._cur_time > 0) {
                        _this.clear2TimeOut();
                        _this._try_timeout_id = egret.setTimeout(function () { _this.tryRequest(); }, _this, _this._cur_time * 1000);
                    }
                    else {
                        _this.tryRequest();
                    }
                };
                this.clear2TimeOut = function () {
                    if (_this._try_timeout_id > 0) {
                        egret.clearTimeout(_this._try_timeout_id);
                        _this._try_timeout_id = 0;
                    }
                };
                this.tryRequest = function () {
                    _this._http.open(_this._openUrl, _this._isGet ? egret.HttpMethod.GET : egret.HttpMethod.POST);
                    if (_this._param && !_this._isGet) {
                        if (!_this._crypto) {
                            _this._http.send(_this._param);
                        }
                        else {
                            var $postData = { data: _this._crypto.encryp(_this._param) };
                            _this._http.send($postData);
                        }
                    }
                    else {
                        _this._http.send();
                    }
                };
                this._callback = $callback;
            }
            Object.defineProperty(WebHttp.prototype, "senderCallback", {
                get: function () {
                    return this._sender;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 开始请求HTTP
             * @param $tag 标签
             * @param $url 地址
             * @param $callback 回调函数
             * @param $param 参数 <b style="color:red"> 如 const $data : Object = {user_name: this._infoUser.nickName}</b>(默认:null)
             * @param $cryPto 加解密
             * @param $isGet 是否为GET模式(默认:true)
             * @param $isTry 请求失败是否重新请求(默认:true)
             * @param $try_count <b style="color:red"> null/≤0 : 重新请求次数( 默认 : 3 )</b>
             * @param $try_time <b style="color:red">秒 null/≤0 : 重新请求等待时间( 默认 : 0.15 ) </b>
             * @param $isTextContent <b style="color:blue">是否为文本 , 如果不是, 则为二进制ArrayBuffer(默认 : true)</b>
             */
            WebHttp.prototype.start = function ($tag, $url, $callback, $param, $cryPto, $isGet, $isTry, $try_count, $try_time, $isTextContent) {
                if ($param === void 0) { $param = null; }
                if ($cryPto === void 0) { $cryPto = null; }
                if ($isGet === void 0) { $isGet = true; }
                if ($isTry === void 0) { $isTry = true; }
                if ($try_count === void 0) { $try_count = null; }
                if ($try_time === void 0) { $try_time = null; }
                if ($isTextContent === void 0) { $isTextContent = true; }
                if ($isTry) {
                    this._try_count = 0;
                    if (!$try_count || $try_count > 0) {
                        this._cur_try = !$try_count ? this._try : $try_count;
                    }
                    else {
                        this._cur_try = this._try;
                    }
                    if (!$try_time || $try_time > 0) {
                        this._cur_time = !$try_time ? this._try_time : $try_time;
                    }
                    else {
                        this._cur_time = this._try_time;
                    }
                }
                this._tag = $tag;
                this._sender = $callback;
                this._url = $url;
                this._param = $param;
                this._crypto = $cryPto;
                this._isGet = $isGet;
                this._isTry = $isTry;
                if (!this._http) {
                    this.create($isTextContent);
                }
                else {
                    this._http.responseType = $isTextContent ? egret.HttpResponseType.TEXT : egret.HttpResponseType.ARRAY_BUFFER;
                }
                this._openUrl = $url;
                if ($isGet && $param) {
                    this._openUrl += "?";
                    if (!this._crypto) {
                        var $data = "";
                        for (var item in $param) {
                            $data += item + "=" + $param[item] + "&";
                        }
                        $data = $data.substr(0, $data.length - 1);
                        this._openUrl += $data;
                    }
                    else {
                        this._openUrl += "data=" + this._crypto.encryp($param);
                    }
                }
                this._http.open(this._openUrl, $isGet ? egret.HttpMethod.GET : egret.HttpMethod.POST);
                this.handlerListener(true);
                if ($param && !$isGet) {
                    if (!this._crypto) {
                        this._http.send($param);
                    }
                    else {
                        var $postData = { data: this._crypto.encryp($param) };
                        this._http.send($postData);
                    }
                }
                else {
                    this._http.send();
                }
            };
            /**
             * 新建http请求类
             */
            WebHttp.prototype.create = function ($isTextContent) {
                this._http = new egret.HttpRequest();
                this._http.responseType = $isTextContent ? egret.HttpResponseType.TEXT : egret.HttpResponseType.ARRAY_BUFFER;
                this._http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            };
            WebHttp.prototype.handlerListener = function ($isAdd) {
                if ($isAdd) {
                    if (!this._http.hasEventListener(egret.Event.COMPLETE))
                        this._http.addEventListener(egret.Event.COMPLETE, this.onHttpComplete, this);
                    if (!this._http.hasEventListener(egret.IOErrorEvent.IO_ERROR))
                        this._http.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onHttpError, this);
                }
                else {
                    if (this._http.hasEventListener(egret.Event.COMPLETE))
                        this._http.removeEventListener(egret.Event.COMPLETE, this.onHttpComplete, this);
                    if (this._http.hasEventListener(egret.IOErrorEvent.IO_ERROR))
                        this._http.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onHttpError, this);
                }
            };
            /**
             * @inheritDoc
             */
            WebHttp.prototype.destroy = function ($callback, $params) {
                this.clear2TimeOut();
                if (this._http) {
                    this._http.abort();
                    this.handlerListener(false);
                    this._http = null;
                }
                if (this._callback) {
                    this._callback = null;
                }
                if (this._sender) {
                    this._sender = null;
                }
                if (this._crypto)
                    this._crypto = null;
                $callback && $callback($params);
            };
            return WebHttp;
        }());
        network.WebHttp = WebHttp;
        __reflect(WebHttp.prototype, "lib2egret.network.WebHttp", ["lib2egret.common.IDestroy"]);
        /**
         * HTTP 返回数据类型
         * @author Aonaufly
         */
        var TYPE_HTTP_CALLBACK;
        (function (TYPE_HTTP_CALLBACK) {
            /**错误*/
            TYPE_HTTP_CALLBACK[TYPE_HTTP_CALLBACK["_ERROR"] = 1] = "_ERROR";
            /**数据返回完毕*/
            TYPE_HTTP_CALLBACK[TYPE_HTTP_CALLBACK["_COMPLETE"] = 2] = "_COMPLETE";
        })(TYPE_HTTP_CALLBACK = network.TYPE_HTTP_CALLBACK || (network.TYPE_HTTP_CALLBACK = {}));
    })(network = lib2egret.network || (lib2egret.network = {}));
})(lib2egret || (lib2egret = {}));
