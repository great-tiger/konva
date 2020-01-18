import { IShapeConfig } from './interfaces/IShapeConfig';
import { Node } from './Node';
export class Shape<Config extends IShapeConfig = IShapeConfig> extends Node<Config> {
    drawScene(): void {
        var layer = this.getLayer(),
            context = layer.getContext(),
            drawFunc = this.getSceneFunc();

        context.save()
        drawFunc.call(this, context)
        context.restore()
    }

    getSceneFunc() {
        return this['_sceneFunc'];
    }
}