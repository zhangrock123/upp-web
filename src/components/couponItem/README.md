# couponItem

## 优惠券卡片

### props

|参数|类型|是否必须|说明|备注|
|---|---|---|---|---|
|coupon|Object|否|卡券信息|默认{}|
|disabled|Boolean|否|显示灰色不可用样式|默认false|
|actionType|String|否|卡券可操作或显示文案|checkbox=>显示复选框,expired=>显示卡券过期文案,used=>显示卡券已使用文案,toUse=>显示立即使用按钮|
|couponId|Any|否|actionType为checkbox时候用到，设置已选中||
|isLink|Boolean|否|设置点击link样式|默认false|

### slot

``无``

### events

|事件名称|说明|
|-------|---|
|click|点击某个优惠券的时候触发|
