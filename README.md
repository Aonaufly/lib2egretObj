# lib2egretObj
游戏（erget）框架工程

#MVC
一：模块配置如下
<?xml version="1.0" encoding="UTF-8"?>
<mvc>
	<controller maincode="1" layoutIndex="1" id="city" name="aa.xx" proxyName="aa.xx" loading="1" loadingName="aa.xx" destroyRes="1" closeDestroy="1">
		<view name="aa.xx" effect="aa.xx" closecd="10" mask="0x000000|0.7"/>
	</controller>
</mvc>	
需要使用MvcConfMgr.Instance.init2XMLRoot初始化配置
约定： 1为true 0为false
aa.xx 均为类对象引用 ， 如 eui.Group
如 标签 controller 属性 ①，name：controller的类引用对象 ， 
②，proxyName：此controller中的model代理引用对象
③，loadingName：加载资源时候的loading引用对象（当loading为1时有效）
maincode: 模块数字代码（唯一）
layoutIndex： 表示层级（从0开始）使用GameLayoutMgr.Instance.init来初始层级等信息
id： 此module的key ， 主要资源group名称设置成此值（唯一）
loading： 是否需要加载资源包（懒加载设置）无：不加载
destroyRes： 销毁此module时，是否将此module的资源包销毁 ， 无： 不销毁
closeDestroy： 是否在关闭时自动销毁此module 无： 不自动销毁

 标签view： controller下view的标签
name： view的引用对象
effect： view开启/关闭动画特效，需要继承BaseUIEffect基类（无没有特效）
closecd： 自动关闭时间（以秒为单位）无：不用cd关闭窗口
mask：模态窗口 颜色|透明度 ， 无： 不是模态窗口

二：MVC路由
格式 id:aa-bb[:{a:1,b:"cccc"}]
city:package-weapon  表示：city模块下，package下的weapon （这个需要具体项目具体约定）
为加强交互 ， 方便配置（link）跳转
