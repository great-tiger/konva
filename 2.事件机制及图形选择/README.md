### 任务
使 `canvas` 上的图形支持 `mousedown` `mousemove` `mouseup` 事件

### 原理解析
可以把 `Stage` 理解成一个 `div` 容器。 `Layer` 理解成一个 `canvas`。`Stage` 中添加一个 `Layer` 就是在 `div` 里增加一个 `canvas`。

##### 事件分发的原理就是：  
* 在 `div` 上绑定 `mousedown` `mousemove` `mouseup` 三个事件。
* 事件触发后计算出相对于 `canvas` 左上角的坐标。 
* 使用该坐标选择 `canvas` 上的图形，然后触发图形对象相应的事件。

##### canvas上选择图形的原理
绘制图形的要点：
* 每一个画图的 `canvas` 在 `konva` 库内还维护一个对应的 `hitCanvas`。   
* 图形会被同时绘制在 `canvas` 和 `hitCanvas` 上。   
* `hitCanvas` 上的图形被一个随机颜色填充的，并且系统保证不重复，系统内部维护该随机颜色与图形的对应关系。  

选择图形的过程：  
* 通过坐标从 `hitCanvas` 取像素值
* 通过该像素值查找对应的图形

本例故意把 `hitCanvas` 展示到页面上了，可以直观的理解一下。

### 测试代码
```js
import * as Konva from "./src/Index"

var Stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 300
})
var layer = new Konva.Layer()
let rect = new Konva.Rect({
    x: 300,
    y: 10,
    width: 100,
    height: 100,
    stroke: 'green'
})
rect.on('mousedown', function(evt) {
    console.log('mousedown rect');
})
rect.on('mousemove', function(evt) {
    console.log('mousemove rect');
})
rect.on('mouseup', function(evt) {
    console.log('mouseup rect');
})
layer.add(rect)
Stage.add(layer)
```
