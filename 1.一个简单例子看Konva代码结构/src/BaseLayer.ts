import { Shape } from "./Shape";
import { Container } from "./Container";

export abstract class BaseLayer extends Container<Shape> {
   canvas: HTMLCanvasElement = document.createElement('canvas')

   getLayer() {
      return this
   }
   getContext() {
      return this.canvas.getContext('2d')
   }
}