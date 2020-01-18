import { BaseLayer } from './BaseLayer';

export class Layer extends BaseLayer {

    public drawScene() {
        var layer = this.getLayer(),
            context = layer.getContext();

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        super.drawScene()
    }

    _setCanvasSize(width, height) {
        this.canvas.width = width
        this.canvas.height = height
    }
}