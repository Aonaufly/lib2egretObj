module lib2egret.network {
    /**
     * webHttp的通讯模块
     * @author Aonaufly
     */
    export class WebHttp implements common.IDestroy {
        private readonly _try: number = 3;
        private readonly _try_time: number = 0.15;
        private _tag: string;
        private _cur_try: number = null;
        private _cur_time: number = null;
        private _http: egret.HttpRequest = null;
        private _try_count: number = 0;

        private _url: string = null;
        private _openUrl: string = null;
        private _param: object = null;
        private _isGet: boolean = true;
        private _isTry: boolean = true;
        private _try_timeout_id: number = 0;
        private _callback: ($data: IHttpCallBackModel) => void;
        private _sender: ($tag: string, $type: TYPE_HTTP_CALLBACK, $data?: string | ArrayBuffer) => void = null;
        private _crypto: ICrypto = null;

        /**
         * @param {($data: smallLib.IHttpCallBackModel) => void} $callback 回调函数
         */
        public constructor($callback: ($data: IHttpCallBackModel) => void) {
            this._callback = $callback;
        }

        public get senderCallback(): ($tag: string, $type: TYPE_HTTP_CALLBACK, $data?: string | ArrayBuffer) => void {
            return this._sender;
        }

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
        public start(
            $tag: string,
            $url: string,
            $callback: ($tag: string, $type: TYPE_HTTP_CALLBACK, $data?: string | ArrayBuffer) => void,
            $param: Object = null,
            $cryPto: ICrypto = null,
            $isGet: boolean = true,
            $isTry: boolean = true,
            $try_count: number = null,
            $try_time: number = null,
            $isTextContent: boolean = true
        ): void {
            if ($isTry) {
                this._try_count = 0;
                if (!$try_count || $try_count > 0) {
                    this._cur_try = !$try_count ? this._try : $try_count;
                } else {
                    this._cur_try = this._try;
                }
                if (!$try_time || $try_time > 0) {
                    this._cur_time = !$try_time ? this._try_time : $try_time;
                } else {
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
            } else {
                this._http.responseType = $isTextContent ? egret.HttpResponseType.TEXT : egret.HttpResponseType.ARRAY_BUFFER;
            }
            this._openUrl = $url;
            if ($isGet && $param) {
                this._openUrl += `?`;
                if (!this._crypto) {
                    let $data: string = ``;
                    for (var item in $param) {
                        $data += item + "=" + $param[item] + "&";
                    }
                    $data = $data.substr(0, $data.length - 1);
                    this._openUrl += $data;
                } else {
                    this._openUrl += `data=${this._crypto.encryp($param)}`;
                }

            }
            this._http.open(this._openUrl, $isGet ? egret.HttpMethod.GET : egret.HttpMethod.POST);
            this.handlerListener(true);
            if ($param && !$isGet) {
                if (!this._crypto) {
                    this._http.send($param);
                } else {
                    let $postData: Object = { data: this._crypto.encryp($param) };
                    this._http.send($postData);
                }
            } else {
                this._http.send();
            }
        }

        /**
         * 新建http请求类
         */
        private create($isTextContent: boolean): void {
            this._http = new egret.HttpRequest();
            this._http.responseType = $isTextContent ? egret.HttpResponseType.TEXT : egret.HttpResponseType.ARRAY_BUFFER;
            this._http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        private handlerListener($isAdd: boolean): void {
            if ($isAdd) {
                if (!this._http.hasEventListener(egret.Event.COMPLETE))
                    this._http.addEventListener(egret.Event.COMPLETE, this.onHttpComplete, this);
                if (!this._http.hasEventListener(egret.IOErrorEvent.IO_ERROR))
                    this._http.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onHttpError, this);
            } else {
                if (this._http.hasEventListener(egret.Event.COMPLETE))
                    this._http.removeEventListener(egret.Event.COMPLETE, this.onHttpComplete, this);
                if (this._http.hasEventListener(egret.IOErrorEvent.IO_ERROR))
                    this._http.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onHttpError, this);
            }
        }
        private onHttpComplete: Function = ($e: egret.Event): void => {
            if (<egret.HttpRequest>$e.currentTarget == this._http) {
                this.handlerListener(false);
                let $response: any = this._http.response;
                if (this._crypto) {
                    $response = this._crypto.decrypt($response);
                }
                this._callback({
                    _tag: this._tag,
                    _target: this,
                    _type: TYPE_HTTP_CALLBACK._COMPLETE,
                    _complete: $response
                });
            }
        }
        private onHttpError: Function = ($e: egret.IOErrorEvent): void => {
            if (<egret.HttpRequest>$e.currentTarget == this._http) {
                if (this._isTry) {
                    this._try_count++;
                    if (this._try_count >= this._cur_try) {
                        //报错
                        egret.warn(`${this._isGet ? "GET" : "POST"} :: ${$e}`);
                        this.handlerListener(false);
                        this._callback({
                            _tag: this._tag,
                            _target: this,
                            _type: TYPE_HTTP_CALLBACK._ERROR
                        });
                    } else {
                        //处理重试
                        this.handler2try();
                    }
                } else {
                    //报错
                    egret.warn(`${this._isGet ? "GET" : "POST"} :: ${$e}`);
                    this.handlerListener(false);
                    this._callback({
                        _tag: this._tag,
                        _target: this,
                        _type: TYPE_HTTP_CALLBACK._ERROR
                    });
                }
            }
        }
        private handler2try: Function = (): void => {
            if (this._cur_time > 0) {
                this.clear2TimeOut();
                this._try_timeout_id = egret.setTimeout(
                    (): void => { this.tryRequest(); },
                    this,
                    this._cur_time * 1000
                );
            } else {
                this.tryRequest();
            }
        }
        private clear2TimeOut: Function = (): void => {
            if (this._try_timeout_id > 0) {
                egret.clearTimeout(this._try_timeout_id);
                this._try_timeout_id = 0;
            }
        };
        private tryRequest: Function = (): void => {
            this._http.open(this._openUrl, this._isGet ? egret.HttpMethod.GET : egret.HttpMethod.POST);
            if (this._param && !this._isGet) {
                if (!this._crypto) {
                    this._http.send(this._param);
                } else {
                    let $postData: Object = { data: this._crypto.encryp(this._param) };
                    this._http.send($postData);
                }
            } else {
                this._http.send();
            }
        };

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
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
        }
    }

    export interface IHttpCallBackModel {
        _tag: string;
        _target: WebHttp;
        _type: TYPE_HTTP_CALLBACK;
        _complete?: string | ArrayBuffer;
    }

    /**
     * HTTP 返回数据类型
     * @author Aonaufly
     */
    export enum TYPE_HTTP_CALLBACK {
        /**错误*/
        _ERROR = 0,
        /**数据返回完毕*/
        _COMPLETE = 1
    }
}
