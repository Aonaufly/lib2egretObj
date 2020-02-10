module lib2egret.common{
    /**深拷贝
     *@author Aonaufly
     */
    export class DeepCopyTool {
        /**
         *深拷贝
         *@param tgt 对象Tp
         */
        public static toDeepCopy<Tp extends object>(tgt: Tp): Tp{
            let cp: Tp = null;
            let ptn: number = 0;
            if (tgt === null) {
                cp = tgt;
            } else if (tgt instanceof Date) {
                cp = new Date((tgt as any).getTime()) as any;
            } else if (Array.isArray(tgt)) {
                cp = [] as any;
                (tgt as any[]).forEach((v, i, arr) => { (cp as any).push(v); });
                cp = (cp as any).map((n: any) => DeepCopyTool.toDeepCopy<any>(n));
            } else if ((typeof(tgt) === 'object') && (tgt !== {})) {
                cp = { ...(tgt as Object) } as Tp;
                Object.keys(cp).forEach(k => {
                    (cp as any)[k] = DeepCopyTool.toDeepCopy<any>((cp as any)[k]);
                });
            } else {
                cp = tgt;
            }
            return cp;
        }
    }
}
