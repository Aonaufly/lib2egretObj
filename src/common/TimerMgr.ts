module lib2egret.common {
    /**
     * 系统计时器
     * @author Aonaufly
     */
    export class TimerMgr extends BaseSingle {
        public static get Instance(): TimerMgr {
            if (!TimerMgr._instance)
                TimerMgr._instance = new TimerMgr();
            return <TimerMgr>TimerMgr._instance;
        }
        private _list: Array<ITimerData>;
        private _timer: egret.Timer;
        private _milliseconds: number;
        private readonly _DELAY: number = 1000;
        private constructor() {
            super();
            this._list = [];
        }

        /**
         * 启动主计时器
         * @param $milliseconds 毫秒
         */
        public start($milliseconds: number): void {
            if ($milliseconds == null) {
                $milliseconds = new Date().getTime();
            }
            this._milliseconds = $milliseconds;
            this._timer = new egret.Timer(this._DELAY);
            this.listener();
            this._timer.start();
        }

        /**
         * 绑定CD
         * @param $key 倒计时的key值
         * @param $second
         * @param $callback
         * @param $isEvery 是否每秒都要执行一次callback
         * @param $repeatCount 重复次数 <=0 表示永久执行
         * @param $forceVover 是否强制覆盖已有的CD数据
         */
        public bindCD($key: string, $second: number, $callback: ($key: string, $cd?: number) => void, $isEvery: boolean, $repeatCount: number = 1, $forceVover: boolean = true): void {
            let $cell: ITimerData;
            if (!this.isExist($key)) {
                $cell = {
                    $key: $key,
                    $callback: $callback,
                    $cd: $second,
                    $index: $second,
                    $every: $isEvery,
                    $discard: false,
                    $repeatCount: $repeatCount,
                    $repeatIndex: 0
                };
            } else {
                if ($forceVover) {
                    $cell = this.getCell($key);
                    $cell.$callback = $callback;
                    $cell.$cd = $second;
                    $cell.$index = $second;
                    $cell.$every = $isEvery;
                    $cell.$discard = false;
                    $cell.$repeatCount = $repeatCount;
                    $cell.$repeatIndex = 0;
                }
            }
            $cell && this._list.push($cell);
        }

        /**
         * 移除绑定
         * @param $key
         */
        public removeBind($key: string): void {
            if (!this._list || this._list.length == 0) return;
            let $cell: ITimerData;
            for (let $i: number = 0, $j: number = this._list.length; $i < $j; $i++) {
                $cell = this._list[$i];
                if ($cell.$key == $key) {
                    this._list.splice($i, 1);
                    break;
                }
            }
        }

        private getCell($key: string): ITimerData {
            let $cell: ITimerData;
            for (let $i: number = 0, $j: number = this._list.length; $i < $j; $i++) {
                $cell = this._list[$i];
                if ($cell.$key == $key) {
                    return $cell;
                }
            }
            return null;
        }

        public isExist($key: string): boolean {
            if (!this._list || this._list.length == 0) return false;
            let $cell: ITimerData;
            for (let $i: number = 0, $j: number = this._list.length; $i < $j; $i++) {
                $cell = this._list[$i];
                if ($cell.$key == $key) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 绑定一个具体时间
         * @param $key 倒计时的key值
         * @param $overMilliseconds 截至时间(毫秒计算)
         * @param $callback
         * @param $isEvery 是否每秒都要执行一次callback
         * @param $forceVover 是否强制覆盖已有的CD数据
         */
        public bindTime($key: string, $overMilliseconds: number, $callback: ($key: string, $cd?: number) => void, $isEvery: boolean, $forceVover: boolean = true): boolean {
            const $cd: number = Math.floor(($overMilliseconds - this._milliseconds) / 1000);
            if ($cd > 0) {
                this.bindCD($key, $cd, $callback, $isEvery, 1, $forceVover);
                return true;
            }
            return false;
        }

        private listener(): void {
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.onEveryHandler, this);
        }

        private onEveryHandler($e: egret.TimerEvent): void {
            this._milliseconds += this._DELAY;
            if (this._list && this._list.length > 0) {
                let $cell: ITimerData;
                for (let $i: number = 0, $j: number = this._list.length; $i < $j; $i++) {
                    $cell = this._list[$i];
                    if ($cell.$discard) {
                        this._list.splice($i, 1);
                        $i--;
                        $j--;
                        continue;
                    }
                    this.doCallback($cell).then(this.doAsync).catch(e => console.log(e));
                }
            }
        }

        private doAsync: ($data: { del: boolean, cell: ITimerData }) => void = ($data): void => {
            if ($data.del) {
                $data.cell.$discard = true;
            }
        };

        //处理回调
        private async doCallback($cell: ITimerData): Promise<{ del: boolean, cell: ITimerData }> {
            $cell.$cd -= 1;
            if ($cell.$repeatCount >= 1 && $cell.$cd <= 0) $cell.$repeatIndex += 1;
            return new Promise<{ del: boolean, cell: ITimerData }>((resolve, reject): void => {
                if ($cell.$every) {
                    $cell.$callback($cell.$key, $cell.$cd);
                    if ($cell.$repeatCount <= 0 || $cell.$repeatIndex < $cell.$repeatCount) {
                        resolve({ del: false, cell: $cell });
                    } else {
                        resolve({ del: $cell.$cd <= 0, cell: $cell });
                    }
                } else {
                    if ($cell.$cd <= 0) {
                        $cell.$callback($cell.$key);
                        if ($cell.$repeatCount <= 0 || $cell.$repeatIndex < $cell.$repeatCount) {
                            resolve({ del: false, cell: $cell });
                        } else {
                            resolve({ del: true, cell: $cell });
                        }
                    } else {
                        resolve({ del: false, cell: $cell });
                    }
                }
                if (($cell.$repeatCount <= 0 || $cell.$repeatIndex < $cell.$repeatCount) && $cell.$cd <= 0) {
                    $cell.$cd = $cell.$index;
                }
            });
        }
    }

    export interface ITimerData {
        //倒计时的key
        $key: string;
        //回调函数
        $callback: ($key: string, cd?: number) => void;
        //剩余时间(S)
        $cd: number;
        //倒计时
        $index: number;
        //是否每秒触发
        $every: boolean;
        //执行次数
        $repeatCount: number;
        //已经执行的次数
        $repeatIndex: number;
        //是否作废
        $discard: boolean;
    }
}
