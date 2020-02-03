module lib2egret.common {
    /**
     * 贝塞尔曲线
     * @author Aonaufly
     */
    export class BezierPlayer implements IDestroy {
        private target: egret.DisplayObject;
        private locations: Array<{ x: number, y: number }>;
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
            let $x: number = 0, $y: number = 0;
            let $bezier: number;
            for (let $i: number = 0, $n: number = this.locations.length; $i < $n; $i++) {
                $bezier = Math.min(Math.pow(1 - value, $n - $i - 1) * Math.pow(value, $i)) * this.calculationC($i, $n);
                $x += this.locations[$i].x * $bezier;
                $y += this.locations[$i].y * $bezier;
            }
            this.target.x = $x;
            this.target.y = $y;
        }

        private calculationC: ($i: number, $n: number) => number = ($i, $n): number => {
            return this.factorial($n - 1) / (this.factorial($i) * this.factorial($n - 1 - $i));
        }

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
        }
    }
}
