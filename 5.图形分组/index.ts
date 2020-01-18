import * as Konva from "./src/Index"

var Stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 300
})
var layer = new Konva.Layer()
let circle = new Konva.Circle({
    x: 200,
    y: 150,
    radius: 20,
    stroke: 'green',
    draggable: true
})
var group = new Konva.Group({
    x: 200,
    y: 150
})

group.add(new Konva.Circle({
    x: 100,
    y: 0,
    radius: 10,
    stroke: 'red',
    draggable: true 
}))

var group1 = new Konva.Group({
    x: 100,
    y: 0
})
group1.add(new Konva.Circle({
    x: 25,
    y: 0,
    stroke: 'purple',
    radius: 5
}))
group.add(group1)


layer.add(circle)
layer.add(group)
Stage.add(layer)

var deg = 0
function render() {
    requestAnimationFrame(function() {
        deg += 0.8
        if (deg > 360) deg = deg % 360
        group.attrs.rotation = deg
        group1.attrs.rotation = deg
        Stage.draw()
        render()
    })
}
render()