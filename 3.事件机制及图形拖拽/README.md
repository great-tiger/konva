### 任务
使 `Rect` 支持 `draggable` 属性

### 原理解析
主要代码集中在 `Drag.ts` 和 `Node.ts` 中

##### Drag.ts
```js
export const DD = {
    _dragElements: new Map(),
    _drag(evt) {
        DD._dragElements.forEach(elem => {
            const { node } = elem
            // 设置新位置
            node._setDragPosition(evt, elem)
        })
    },
}
window.addEventListener('mousemove', DD._drag)
```
`_dragElements` 中保存了所有需要拖拽的元素

##### Node.ts
`Node.ts` 中关键代码
```js
_listenDrag() {
    this.on('mousedown', function (evt) {
        this._createDragElement(evt)
    })
}

_createDragElement(evt) {
    var ap = this.getLayer().getPointerPosition()
    DD._dragElements.set(this._id, {
        node: this,
        startPointerPos: ap,
        offset: {
            x: ap.x - this.getX(),
            y: ap.y - this.getY()
        },
        dragStatus: 'ready'
    })
}
```
`mousedown` 的时候存储当前元素及辅助信息到 `DD._dragElements`。

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
    stroke: 'green',
    draggable: true
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
