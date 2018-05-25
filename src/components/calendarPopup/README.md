# calendarPopup

## 日历选择控件

### props

|参数|类型|是否必须|说明|备注|
|---|---|---|---|---|
|selectType|Number|否|单选／多选日期|默认1 // 0 单选  1 区间选|
|visible|Boolean|否|是否显示popup|默认false|
|value|Array|是|绑定值|// [开始时间，结束时间] 时间格式yyyyMMdd|
|limitDay|Number|否|设置多选天数|默认2|


### slot

``无``

### events

|事件名称|说明|
|-------|---|
|close|popup的回调，自行配置visible的布尔值|
