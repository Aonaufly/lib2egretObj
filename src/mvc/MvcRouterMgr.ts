module lib2egret.mvc {
    /**
     * Mvc路由
     * @author Aonaufly
     */
    export class MvcRouterMgr extends common.BaseSingle {
        public static get Instance(): MvcRouterMgr {
            if (!MvcRouterMgr._instance)
                MvcRouterMgr._instance = new MvcRouterMgr();
            return <MvcRouterMgr>MvcRouterMgr._instance;
        }

        /**
         * 开启路由
         * @param $router
         */
        public openRouter($router: string): void {
            const $routerObj: { module: string, type: Array<string> | string, data: JSON } = this.analysisRouter($router);
            if ($routerObj) {
                MvcMgr.Instance.openController($routerObj.module, null, $routerObj);
            }
        }

        /**
         * 路由数据解析
         * @param $router
         */
        private analysisRouter($router: string): { module: string, type: Array<string> | string, data: JSON } {
            if (!$router || $router.trim().length == 0 || $router.trim().indexOf(`:`) < 0) {
                console.error(`router ${$router} is null or error!`);
                return null;
            }
            const $arr: Array<string> = $router.trim().split(`:`);
            let $type: Array<string> | string;
            if ($arr[1].indexOf(`-`) > 0) {
                let $strArr: Array<string> = $arr[1].trim().split(`-`);
                $type = [];
                $strArr.forEach(($item: string): void => {
                    ($type as Array<string>).push($item.trim());
                });
            } else {
                $type = $arr[1].trim();
            }
            const $data: JSON = $arr.length < 3 ? null : JSON.parse($arr[2]);
            return {
                module: $arr[0].trim(),
                type: $type,
                data: $data
            }

        }
    }
}
