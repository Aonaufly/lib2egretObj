module lib2egret.mvc {
    /**
     * Mvc配置信息管理器
     * @author Aonaufly
     */
    export class MvcConfMgr extends common.BaseSingle {
        private _root: egret.XML;

        /**
         * 获取单例对象句柄
         */
        public static get Instance(): MvcConfMgr {
            if (!MvcConfMgr._instance)
                MvcConfMgr._instance = new MvcConfMgr();
            return <MvcConfMgr>MvcConfMgr._instance;
        }
        private constructor() {
            super();
        }
        /**
         * 初始化配置信息
         * @param $data
         */
        public init2XMLRoot($data: string): void {
            if (!$data || $data.trim().length == 0) {
                console.error(`mvc conf is null`);
                return;
            }
            this._root = egret.XML.parse($data.trim());
        }

        private get RootChildren(): Array<egret.XML> {
            return this._root.children as Array<egret.XML>;
        }

        /**
         * 获取模块配置
         * @param $key 模块id
         */
        public getModulesConf($key: string): egret.XML {
            let $children: Array<egret.XML> = this.RootChildren;
            const $$$errorFun: () => void = (): void => {
                console.warn(`module key: ${$key} no configed!!!`);
            };
            if (!$children || $children.length == 0) {
                $$$errorFun();
                return null;
            }
            let $cell: egret.XML;
            for (let $i: number = 0, $j: number = $children.length; $i < $j; $i++) {
                $cell = $children[$i];
                if ($cell.name == `controller` && $cell[`$id`] == $key) {
                    return $cell;
                }
            }
            $$$errorFun();
            return null;
        }

        /**
         * 获取模块中的View配置
         * @param $moduleConf 模块配置
         */
        public getViewConf($moduleConf: egret.XML): egret.XML {
            let $children: Array<egret.XML> = $moduleConf.children as Array<egret.XML>;
            const $$$errorFun: () => void = (): void => {
                console.warn(`module key: ${$moduleConf[`$id`]} view no configed!`);
            };
            if (!$children || $children.length == 0) {
                $$$errorFun();
                return null;
            }
            let $cell: egret.XML;
            for (let $i: number = 0, $j: number = $children.length; $i < $j; $i++) {
                $cell = $children[$i];
                if ($cell.name == `view`) {
                    return $cell;
                }
            }
            $$$errorFun();
            return null;
        }
    }
}
