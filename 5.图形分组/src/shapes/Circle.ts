import { Shape } from '../Shape';

export class Circle extends Shape {
    _sceneFunc(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.strokeStyle = this.attrs.stroke
        ctx.arc(0, 0, this.attrs.radius, 0, Math.PI * 2)
        ctx.stroke()
    }

    _sceneHit(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.strokeStyle = this.colorKey
        ctx.fillStyle = this.colorKey
        ctx.arc(0, 0, this.attrs.radius, 0, Math.PI * 2) 
        ctx.stroke()
        ctx.fill()
    }
}