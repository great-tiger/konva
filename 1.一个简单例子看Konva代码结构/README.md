### 任务
主要是总结一下`Konva`的整体代码结构及如何把一个简单图形绘制到`canvas`上的。   

### Konva代码结构分析
三条重要的继承链
1. Rect --> Shape --> Node
2. Layer --> BaseLayer --> Container --> Node
3. Stage --> Container --> Node   
   
> `Node` 为所有类的基类, 它是一个 `抽象类` ，它当中有一个重要的方法 `draw`, 该方法会调用 `抽象方法` `drawScene`。 该方法由 `父类` 实现，负责图形绘制。  

> `Container` 该类的 `children` 属性可以维护多个 `Node`。负责绘制多个 `Node`。

> 每一个 `Layer` 实例对应一个 `canvas` 元素

### 测试代码
```js
import * as Konva from "./src/Index"

var Stage = new Konva.Stage({
    container: 'container',
    width: 800,
    height: 600
})
var layer = new Konva.Layer()
let rect = new Konva.Rect({
    x: 300,
    y: 0,
    width: 100,
    height: 100
})

layer.add(rect)
Stage.add(layer)
```
