import * as Konva from "./src/Index"

var Stage = new Konva.Stage({
    container: 'container',
    width: 800,
    height: 600
})
var layer = new Konva.Layer()
let rect = new Konva.Rect({
    x: 300,
    y: 10,
    width: 100,
    height: 100,
    stroke: 'green'
})

layer.add(rect)
Stage.add(layer)