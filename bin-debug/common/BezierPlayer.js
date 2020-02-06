var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lib2egret;
(function (lib2egret) {
    var common;
    (function (common) {
        /**
         * 贝塞尔曲线
         * @author Aonaufly
         */
        var BezierPlayer = (function () {
            function BezierPlayer(target, locations) {
                if (locations === void 0) { locations = null; }
                var _this = this;
                this.calculationC = function ($i, $n) {
                    return _this.factorial($n - 1) / (_this.factorial($i) * _this.factorial($n - 1 - $i));
                };
                this.factorial = function (num) {
                    if (num < 0) {
                        return 1;
                    }
                    else if (num === 0 || num === 1) {
                        return 1;
                    }
                    else {
                        return (num * _this.factorial(num - 1));
                    }
                };
                this.target = target;
                if (locations) {
                    this.locations = locations;
                    this.target.x = this.locations[0].x;
                    this.target.y = this.locations[0].y;
                }
            }
            /**
             * 更新路径
             * @param locations 路径坐标
             */
            BezierPlayer.prototype.updateLocations = function (locations) {
                this.locations = locations;
                this.target.x = this.locations[0].x;
                this.target.y = this.locations[0].y;
            };
            Object.defineProperty(BezierPlayer.prototype, "factor", {
                get: function () {
                    return 0;
                },
                set: function (value) {
                    this.$x = 0;
                    this.$y = 0;
                    for (this.$i = 0, this.$n = this.locations.length; this.$i < this.$n; this.$i++) {
                        this.$bezier = Math.min(Math.pow(1 - value, this.$n - this.$i - 1) * Math.pow(value, this.$i)) * this.calculationC(this.$i, this.$n);
                        this.$x += this.locations[this.$i].x * this.$bezier;
                        this.$y += this.locations[this.$i].y * this.$bezier;
                    }
                    this.target.x = this.$x;
                    this.target.y = this.$y;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            BezierPlayer.prototype.destroy = function ($callback, $params) {
                if (this.target)
                    this.target = null;
                this.locations = null;
                $callback && $callback($params);
            };
            return BezierPlayer;
        }());
        common.BezierPlayer = BezierPlayer;
        __reflect(BezierPlayer.prototype, "lib2egret.common.BezierPlayer", ["lib2egret.common.IDestroy"]);
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
