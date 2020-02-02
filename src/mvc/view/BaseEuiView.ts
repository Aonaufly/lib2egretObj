module lib2egret.mvc {
    /**
     * EUI基类
     * @author Aonaufly
     */
    export abstract class BaseEuiView<T> extends eui.Component implements IMvcView<T> {
        /**开启数据*/
        protected _data: T;
        protected _parent: egret.DisplayObjectContainer;
        protected _mask: egret.Shape;
        protected _eff: BaseUIEffect;
        protected _closeCD: number = null;
        protected _isInit: boolean = false;
        protected _wait: { data: T, router: { module: string, type: Array<string> | string, data: JSON } } | { noParams: boolean, router: { module: string, type: Array<string> | string, data: JSON } } = null;
        private _callback: ($type: string, $data?: any) => void;
        public constructor($parent: egret.DisplayObjectContainer, $data?: egret.XML, $callback?: ($type: string, $data?: any) => void) {
            super();
            this._parent = $parent;
            this._callback = $callback;
            $data && this.analysisParamXml($data);
        }
        protected analysisParamXml($data: egret.XML): void {
            let $params: string;
            if ($data[`$mask`]) {
                $params = ($data[`$mask`] as string).trim();
                let $color: number = 0x000000, $alpha: number = 0.7;
                if ($params.indexOf(`|`) > 0) {
                    const $arr: Array<string> = $params.split(`|`);
                    $color = parseInt($arr[0]);
                    $alpha = parseFloat($arr[1]);
                }
                this._mask = new egret.Shape();
                this._mask.width = this._parent.width;
                this._mask.height = this._parent.height;
                this._mask.graphics.beginFill($color, $alpha);
                this._mask.graphics.drawRect(0, 0, this._parent.width, this._parent.height);
                this._mask.graphics.endFill();
                this._mask.touchEnabled = true;
            }
            if ($data[`$effect`]) {
                $params = ($data[`$effect`] as string).trim();
                let $eClass: any = egret.getDefinitionByName($params);
                this._eff = new $eClass(this, this._mask);
            }
            if ($data[`$closecd`] && +<number>$data[`$closecd`] > 0) {
                this._closeCD = +<number>$data[`$closecd`];
            }
        }

        /**
         * @inheritDoc
         */
        protected childrenCreated(): void {
            super.childrenCreated();
            this._isInit = true;
            if (this._wait != null) {
                if (this._wait.hasOwnProperty(`noParams`)) {
                    this.setUI(null, this._wait.router);
                } else {
                    this.setUI((this._wait as { data: T, router: { module: string, type: Array<string> | string, data: JSON } }).data, (this._wait as { data: T, router: { module: string, type: Array<string> | string, data: JSON } }).router);
                }
                this._wait = null;
            }
        }

        /**
         * 监听事件
         * @param $isAdd 是否添加监听
         */
        protected abstract listener($isAdd: boolean): void;

        /**
         * 设置对象最表
         */
        protected setLo(): void {
            this.x = (this._parent.width - this.width) >> 1;
            this.y = (this._parent.height - this.height) >> 1;
        }

        /**
         * @inheritDoc
         * 切勿重写
         */
        public open($data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): void {
            if (this._isInit) {
                this.setUI($data, $router);
            } else {
                if ($data != null) {
                    this._wait = { data: $data, router: $router };
                } else {
                    this._wait = { noParams: true, router: $router };
                }
            }
        }

        /**
         * 设置UI
         * @param $data 打开数据
         * @param $router 路由数据
         */
        protected setUI($data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): void {
            this._data = $data;
            if (this._mask) {
                this._parent.addChild(this._mask);
            }
            this.setLo();
            if (this._eff) {
                this._eff.open().then(this.startCloseCD).catch(e => console.log(e));
            } else {
                this.startCloseCD();
            }
            this._parent.addChild(this);
            this.goRouter($router);
        }

        /**
         * 走路由
         * @param $router
         */
        protected goRouter($router: { module: string, type: Array<string> | string, data: JSON }): void {
            if (!$router) return;
        }

        /**
         * @inheritDoc
         */
        public abstract update($type: string, $data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): Promise<void>;

        private startCloseCD: () => void = (): void => {
            this.listener(true);
            if (!this._closeCD) return;
            common.TimerMgr.Instance.bindCD(
                egret.getQualifiedClassName(this),
                this._closeCD,
                this.timer2CloseCD,
                true
            );
        };
        /**
         * 倒计时
         */
        protected abstract timer2CloseCD: ($key: string, $cd?: number) => void;

        /**
         * @inheritDoc
         */
        public close($destroy: boolean = false): Promise<void> {
            this.listener(false);
            return new Promise<void>((resolve, reject): void => {
                if (this._eff) {
                    this._eff.close($destroy).then(
                        ($destroy: boolean): void => {
                            this.onClosed($destroy);
                            resolve();
                        }
                    ).catch(e => console.log(e));
                } else {
                    this.onClosed($destroy);
                    resolve();
                }
            });
        }

        /**
         * 关闭触发
         */
        protected onClosed: ($destroy: boolean) => void = ($destroy: boolean): void => {
            common.CommonTool.remove4Parent(this._mask);
            common.CommonTool.remove4Parent(this);
            common.TimerMgr.Instance.removeBind(egret.getQualifiedClassName(this));
            $destroy && this.destroy();
        };

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            this._mask = null;
            this._eff = null;
            this._callback = null;
        }
    }
}
