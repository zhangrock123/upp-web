# upp-web
公众号

```
  预览地址: https://pin.imike.com/h5/index.html#/index
```

---
### 技术栈

|		技术栈	   |	版本	  |
| 		:-:     |	:-:		  |
|	webpack	    |	3.6.0	  |
|		Vue		    |	2.5.2	  |
|	vue-router	|	3.0.1	  |
|		vuex	    |	3.0.1	  |
|		axios	    |	0.18.0	|
|	mint-ui		  |	2.2.13	|

### 文件目录

```
    |- build							// webpack调试及发布代码
    |- config							// webpack配置
    |- dist								// 待发布代码
    |- node_modules						// 第三方组件
    |- src
    	|- assets						// 静态资源
    		|- icons					// 字体包
    		|- images					// 图片
    		|- styles					// 样式文件
    	|- components					// 自定义组件
    	|- config						// 项目配置
    	|- filters						// 过滤器
    	|- pages						// 项目页面
    	|- router						// 路由配置
    	|- service						// 接口api配置
    	|- store						// vuex配置
    	|- utils						// 公用js组件
    	|- App.vue						// 主页面
    	|- components-installation.js	// 第三方组件安装配置
    	|- main.js						// 资源入口配置
    |- static
    |- .babelrc							// babel配置
    |- .editorconfig					// 代码编辑配置
    |- .gitignore
    |- .jshintrc						// js提示配置
    |- .postcssrc.js					// postcss配置
    |- index_prod_tpl.html				// 发布生产环境模版
    |- index.html						// 本地环境调试模版
    |- package.json
    |- README.md
```


### 项目安装
  运行 ``npm install`` 或 ``cnpm install``(需要安装淘宝镜像)

### 项目开发
  运行 ``npm start`` 或 ``npm run dev``

### 项目编译发布
  运行 ``npm run production``，``/dist`` 文件夹中的文件用于发布
