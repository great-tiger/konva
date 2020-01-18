### 任务
使 `Rect` 支持旋转平移缩放

### 原理解析
需要注意3个地方
##### Shape.ts
```js
drawScene(): void {
    var layer = this.getLayer(),
        context = layer.getContext(),
        drawFunc = this.getSceneFunc();

    context.save()
    let at = this.getAbsoluteTransform().getMatrix()
    context.transform(at[0], at[1], at[2], at[3], at[4], at[5])
    drawFunc.call(this, context)
    context.restore()
}
```
画图开始之前首先设置矩阵

##### Rect.ts
```js
_sceneFunc(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.strokeStyle = this.getStroke()
    // 坐标为0，0
    ctx.rect(0, 0, this.getWidth(), this.getHeight())
    ctx.stroke()
}
```
##### Node.ts
增加了 `getAbsoluteTransform` 方法，获取变换矩阵
### 测试代码
参考index.ts
