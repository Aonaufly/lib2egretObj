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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var lib2egret;
(function (lib2egret) {
    var common;
    (function (common) {
        /**
         * 系统计时器
         * @author Aonaufly
         */
        var TimerMgr = (function (_super) {
            __extends(TimerMgr, _super);
            function TimerMgr() {
                var _this = _super.call(this) || this;
                _this._DELAY = 1000;
                _this.doAsync = function ($data) {
                    if ($data.del) {
                        $data.cell.$discard = true;
                    }
                };
                _this._list = [];
                return _this;
            }
            Object.defineProperty(TimerMgr, "Instance", {
                /**
                 * 获取单例对象句柄
                 */
                get: function () {
                    if (!TimerMgr._instance)
                        TimerMgr._instance = new TimerMgr();
                    return TimerMgr._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 启动主计时器
             * @param $milliseconds 毫秒
             */
            TimerMgr.prototype.start = function ($milliseconds) {
                if ($milliseconds == null) {
                    $milliseconds = new Date().getTime();
                }
                this._milliseconds = $milliseconds;
                this._timer = new egret.Timer(this._DELAY);
                this.listener();
                this._timer.start();
            };
            /**
             * 绑定CD
             * @param $key 倒计时的key值
             * @param $second
             * @param $callback
             * @param $isEvery 是否每秒都要执行一次callback
             * @param $repeatCount 重复次数 <=0 表示永久执行
             * @param $forceVover 是否强制覆盖已有的CD数据
             */
            TimerMgr.prototype.bindCD = function ($key, $second, $callback, $isEvery, $repeatCount, $forceVover) {
                if ($repeatCount === void 0) { $repeatCount = 1; }
                if ($forceVover === void 0) { $forceVover = true; }
                var $cell;
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
                }
                else {
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
            };
            /**
             * 移除绑定
             * @param $key
             */
            TimerMgr.prototype.removeBind = function ($key) {
                if (!this._list || this._list.length == 0)
                    return;
                var $cell;
                for (var $i = 0, $j = this._list.length; $i < $j; $i++) {
                    $cell = this._list[$i];
                    if ($cell.$key == $key) {
                        this._list.splice($i, 1);
                        break;
                    }
                }
            };
            TimerMgr.prototype.getCell = function ($key) {
                var $cell;
                for (var $i = 0, $j = this._list.length; $i < $j; $i++) {
                    $cell = this._list[$i];
                    if ($cell.$key == $key) {
                        return $cell;
                    }
                }
                return null;
            };
            TimerMgr.prototype.isExist = function ($key) {
                if (!this._list || this._list.length == 0)
                    return false;
                var $cell;
                for (var $i = 0, $j = this._list.length; $i < $j; $i++) {
                    $cell = this._list[$i];
                    if ($cell.$key == $key) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * 绑定一个具体时间
             * @param $key 倒计时的key值
             * @param $overMilliseconds 截至时间(毫秒计算)
             * @param $callback
             * @param $isEvery 是否每秒都要执行一次callback
             * @param $forceVover 是否强制覆盖已有的CD数据
             */
            TimerMgr.prototype.bindTime = function ($key, $overMilliseconds, $callback, $isEvery, $forceVover) {
                if ($forceVover === void 0) { $forceVover = true; }
                var $cd = Math.floor(($overMilliseconds - this._milliseconds) / 1000);
                if ($cd > 0) {
                    this.bindCD($key, $cd, $callback, $isEvery, 1, $forceVover);
                    return true;
                }
                return false;
            };
            TimerMgr.prototype.listener = function () {
                this._timer.addEventListener(egret.TimerEvent.TIMER, this.onEveryHandler, this);
            };
            TimerMgr.prototype.onEveryHandler = function ($e) {
                this._milliseconds += this._DELAY;
                if (this._list && this._list.length > 0) {
                    var $cell = void 0;
                    for (var $i = 0, $j = this._list.length; $i < $j; $i++) {
                        $cell = this._list[$i];
                        if ($cell.$discard) {
                            this._list.splice($i, 1);
                            $i--;
                            $j--;
                            continue;
                        }
                        this.doCallback($cell).then(this.doAsync).catch(function (e) { return console.log(e); });
                    }
                }
            };
            //处理回调
            TimerMgr.prototype.doCallback = function ($cell) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        $cell.$cd -= 1;
                        if ($cell.$repeatCount >= 1 && $cell.$cd <= 0)
                            $cell.$repeatIndex += 1;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                if ($cell.$every) {
                                    $cell.$callback($cell.$key, $cell.$cd);
                                    if ($cell.$repeatCount <= 0 || $cell.$repeatIndex < $cell.$repeatCount) {
                                        resolve({ del: false, cell: $cell });
                                    }
                                    else {
                                        resolve({ del: $cell.$cd <= 0, cell: $cell });
                                    }
                                }
                                else {
                                    if ($cell.$cd <= 0) {
                                        $cell.$callback($cell.$key);
                                        if ($cell.$repeatCount <= 0 || $cell.$repeatIndex < $cell.$repeatCount) {
                                            resolve({ del: false, cell: $cell });
                                        }
                                        else {
                                            resolve({ del: true, cell: $cell });
                                        }
                                    }
                                    else {
                                        resolve({ del: false, cell: $cell });
                                    }
                                }
                                if (($cell.$repeatCount <= 0 || $cell.$repeatIndex < $cell.$repeatCount) && $cell.$cd <= 0) {
                                    $cell.$cd = $cell.$index;
                                }
                            })];
                    });
                });
            };
            return TimerMgr;
        }(common.BaseSingle));
        common.TimerMgr = TimerMgr;
        __reflect(TimerMgr.prototype, "lib2egret.common.TimerMgr");
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
