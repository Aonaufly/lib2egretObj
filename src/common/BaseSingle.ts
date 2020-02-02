module lib2egret.common {
    /**
     * 单例基类
     * @author Aonaufly
     */
    export abstract class BaseSingle {
        protected static _instance: BaseSingle = null;
        public constructor() {
            if (BaseSingle._instance) {
                egret.error(`${egret.getQualifiedClassName(this)} is instance , Please use Instance to get instance object！`);
            }
        }
    }
}
