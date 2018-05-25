# appPage

## 用于页面的主容器

### slot

|插槽名称|说明|
|-------|---|
|--|文档区域|

### props

``无``

### events

``无``

***

# appHeader

## 用于副页面的头部（带返回，带标题）

### props

|参数|类型|是否必须|说明|备注|
|---|---|---|---|---|
|title|String|否|标题名称||
|hideLeft|Boolean|否|是否显示左侧操作区域|true=>隐藏左侧区域,false=>显示显示左侧区域|
|leftFn|Function|否|点击左侧区域的回调方法||
|isForceIndex|Boolean|否|点击默认左侧栏强制回到主页|默认false|

### slot

|插槽名称|说明|
|-------|---|
|left|左侧操作区域|
|right|右侧操作区域|

### events

``无``


***

# appFooter

## 用于页面底部的tabbar

### props

|参数|类型|是否必须|说明|备注|
|---|---|---|---|---|
|active|String|否|设置底部菜单选中|index 首页；group 我的团；my 个人中心|

### slot

``无``

### events

``无``


***

# appBox

## 用于页面的占位

### props

``无``

### slot

|插槽名称|说明|
|-------|---|
|--|文档区域|

### events

``无``

***

# appBody

## 用于页面的主内容区域（flex＝1）

### props

``无``

### slot

|插槽名称|说明|
|-------|---|
|--|文档区域|

### events

``无``

***

# appLoadMore

## 用于加载更多

### props

|参数|类型|是否必须|说明|备注|
|---|---|---|---|---|
|scrollDistance|Number|否|距离底部多少距离时候触发加载|默认10|
|method|Function|否|加载更多的方法|方法需要返回promise对象|
|isEmpty|Boolean|否|是否没有数据|默认false|
|allLoaded|Boolean|否|是否加载了全部|默认false|

### slot

|插槽名称|说明|
|-------|---|
|--|文档区域|

### events

``无``

***

# appNavBar

## 用于头部选项卡

### props

|参数|类型|是否必须|说明|备注|
|---|---|---|---|---|
|value|String|是|绑定值，当前选中菜单名称||
|src|Array|否|菜单选项数组|默认[],//数据格式[{type: '',title:''}]|


### slot

|插槽名称|说明|
|-------|---|
|--|文档区域|

### events

|事件名称|说明|
|-------|---|
|change|绑定值被改变时触发|

***

