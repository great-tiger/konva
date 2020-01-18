import { Shape } from "./Shape";
import { Container } from "./Container";

export abstract class BaseLayer extends Container<Shape> {
   canvas: HTMLCanvasElement = document.createElement('canvas')
   hitCanvas: HTMLCanvasElement
   _waitingForDraw = false
   getLayer(): BaseLayer | null {
      return this
   }

   getContext() {
      return this.canvas.getContext('2d')
   }

   getHitCanvas() {
      return this.hitCanvas
   }

   getHitContext() {
      return this.hitCanvas.getContext('2d')
   }

   getIntersection(pos) {
      return null
   }

   batchDraw() {
      if (!this._waitingForDraw) {
          this._waitingForDraw = true
          requestAnimationFrame(() => {
              this.draw()
              this._waitingForDraw = false
          })
      }
  }
}