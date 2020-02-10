module lib2egret.common {
    /**
     * 贝塞尔曲线
     * @author Aonaufly
     */
    export class BezierPlayer implements IDestroy {
        private target: egret.DisplayObject;
        private locations: Array<{ x: number, y: number }>;
        private $i: number;
        private $n: number;
        private $x: number;
        private $y: number;
        private $bezier: number;

        /**
         * @param target 显示对象
         * @param locations 坐标点（default:null）
         */
        public constructor(target: egret.DisplayObject, locations: Array<{ x: number, y: number }> = null) {
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
        public updateLocations(locations: Array<{ x: number, y: number }>): void {
            this.locations = locations;
            this.target.x = this.locations[0].x;
            this.target.y = this.locations[0].y;
        }
        public get factor(): number {
            return 0;
        }
        public set factor(value: number) {
            this.$x = 0;
            this.$y = 0;
            for (this.$i = 0, this.$n = this.locations.length; this.$i < this.$n; this.$i++) {
                this.$bezier = Math.min(Math.pow(1 - value, this.$n - this.$i - 1) * Math.pow(value, this.$i)) * this.calculationC(this.$i, this.$n);
                this.$x += this.locations[this.$i].x * this.$bezier;
                this.$y += this.locations[this.$i].y * this.$bezier;
            }
            this.target.x = this.$x;
            this.target.y = this.$y;
        }

        private calculationC: ($i: number, $n: number) => number = ($i, $n): number => {
            return this.factorial($n - 1) / (this.factorial($i) * this.factorial($n - 1 - $i));
        };

        private factorial: (num: number) => number = (num): number => {
            if (num < 0) {
                return 1;
            } else if (num === 0 || num === 1) {
                return 1;
            } else {
                return (num * this.factorial(num - 1));
            }
        };

        /**
         * @inheritDoc
         */
        public destroy($callback?: ($params?: any) => void, $params?: any): void {
            if (this.target)
                this.target = null;
            this.locations = null;
            $callback && $callback($params);
        }
    }
}
