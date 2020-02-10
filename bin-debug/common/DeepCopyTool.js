var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var lib2egret;
(function (lib2egret) {
    var common;
    (function (common) {
        /**深拷贝
         *@author Aonaufly
         */
        var DeepCopyTool = (function () {
            function DeepCopyTool() {
            }
            /**
             *深拷贝
             *@param tgt 对象Tp
             */
            DeepCopyTool.toDeepCopy = function (tgt) {
                var cp = null;
                var ptn = 0;
                if (tgt === null) {
                    cp = tgt;
                }
                else if (tgt instanceof Date) {
                    cp = new Date(tgt.getTime());
                }
                else if (Array.isArray(tgt)) {
                    cp = [];
                    tgt.forEach(function (v, i, arr) { cp.push(v); });
                    cp = cp.map(function (n) { return DeepCopyTool.toDeepCopy(n); });
                }
                else if ((typeof (tgt) === 'object') && (tgt !== {})) {
                    cp = __assign({}, tgt);
                    Object.keys(cp).forEach(function (k) {
                        cp[k] = DeepCopyTool.toDeepCopy(cp[k]);
                    });
                }
                else {
                    cp = tgt;
                }
                return cp;
            };
            return DeepCopyTool;
        }());
        common.DeepCopyTool = DeepCopyTool;
        __reflect(DeepCopyTool.prototype, "lib2egret.common.DeepCopyTool");
    })(common = lib2egret.common || (lib2egret.common = {}));
})(lib2egret || (lib2egret = {}));
