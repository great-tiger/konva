import { Shape } from '../Shape';

export class Rect extends Shape {
    _sceneFunc(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.strokeStyle = this.attrs.stroke
        ctx.rect(0, 0, this.width(), this.height())
        ctx.stroke()
    }

    _sceneHit(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.strokeStyle = this.colorKey
        ctx.fillStyle = this.colorKey
        ctx.rect(0, 0, this.width(), this.height())
        ctx.stroke()
        ctx.fill()
    }
}