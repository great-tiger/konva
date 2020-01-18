import { BaseLayer } from './BaseLayer';
import { Util, shapes } from './Util';

export class Layer extends BaseLayer {
    // hitCanvas = document.createElement('canvas')
    hitCanvas = document.getElementById('hitCanvas') as HTMLCanvasElement

    public drawScene() {
        var layer = this.getLayer(),
            context = layer.getContext();

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        super.drawScene()
    }

    public drawHit() {
        var layer = this.getLayer(),
            context = layer.getHitContext();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        super.drawHit()
    }
    
    _setCanvasSize(width, height) {
        this.canvas.width = width
        this.canvas.height = height
    }

    getIntersection(pos) {
        if (!pos) return null
        let p = this.getHitContext().getImageData(
            Math.round(pos.x),
            Math.round(pos.y),
            1,
            1
        ).data,
            p3 = p[3],
            colorKey,
            shape

        if (p3 === 255) {
            colorKey = Util._rgbToHex(p[0], p[1], p[2])
            shape = shapes['#' + colorKey]
            if (shape) {
                return shape
            }
        }
    }
}