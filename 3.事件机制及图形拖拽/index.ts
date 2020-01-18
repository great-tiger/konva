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