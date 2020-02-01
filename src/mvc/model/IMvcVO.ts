module lib2egret.mvc {
    /**
     * 数据单元VO
     * @author Aonaufly
     */
    export interface IMvcVO<T> extends bind.BindBaseModel {
        id?: T;
    }
}
