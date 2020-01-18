import * as Konva from "./src/Index"

var Stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 300
})
var layer = new Konva.Layer()
let rect = new Konva.Rect({
    x: 150,
    y: 150,
    width: 50,
    height: 50,
    stroke: 'green',
    draggable: true
})

layer.add(rect)
layer.add(new Konva.Rect({
    x: 350,
    y: 10,
    width: 50,
    height: 50,
    scaleX: 2,
    scaleY: 2,
    stroke: 'green',
    draggable: true
}))

layer.add(new Konva.Rect({
    x: 150,
    y: 150,
    width: 50,
    height: 50,
    scaleX: 2,
    scaleY: 2,
    stroke: 'green',
    draggable: true,
    offsetX: 25,
    offsetY: 25,
    rotation: 45
}))

Stage.add(layer)