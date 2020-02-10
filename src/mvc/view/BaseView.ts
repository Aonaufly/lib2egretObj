module lib2egret.mvc {
    /**
     * 普通UI基类
     * @author Aonaufly
     */
    export abstract class BaseView<T> extends egret.DisplayObjectContainer implements IMvcView<T>{
        /**开启数据*/
        protected _data: T;
        protected _parent: egret.DisplayObjectContainer;
        protected _mask: egret.Shape;
        protected _eff: BaseUIEffect;
        protected _closeCD: number = null;
        private _callback: ($type: string, $data?: any) => void;
        public constructor($parent: egret.DisplayObjectContainer, $data?: egret.XML, $callback?: ($type: string, $data?: any) => void) {
            super();
            this._parent = $parent;
            this._callback = $callback;
            $data && this.analysisParamXml($data);
            this.init2UI();
        }

        /**
         * 初始化必要UI
         */
        protected abstract init2UI(): void;
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
         * 监听处理
         * @param $isAdd 是否添加
         */
        protected abstract listener($isAdd: boolean): void;

        /**
         * 设置对象的坐标
         */
        protected setLo(): void {
            this.x = (this._parent.width - this.width) >> 1;
            this.y = (this._parent.height - this.height) >> 1;
        }

        /**
         * @inheritDoc
         */
        public open($data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): void {
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
            this.listener(true);
            this.goRouter($router);
        }

        /**
         * @inheritDoc
         */
        public abstract update($type: string, $data?: T, $router?: { module: string, type: Array<string> | string, data: JSON }): Promise<void>;

        /**
         * 走路由
         * @param $router
         */
        protected goRouter($router: { module: string, type: Array<string> | string, data: JSON }): void {
            if (!$router) return;
        }

        private startCloseCD: () => void = (): void => {
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
         * 关闭UI触发
         * @param $destroy 是否销毁
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
            $callback && $callback($params);
        }
    }
}
