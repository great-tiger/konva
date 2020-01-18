import { IStageConfig } from './interfaces/IStageConfig';
import { Container } from "./Container";
import { BaseLayer } from "./BaseLayer";

export class Stage extends Container<BaseLayer> {
    content: HTMLDivElement
    constructor(config: IStageConfig) {
        super(config)
        this._buildDOM()
    }

    container() {
        return this.attrs.container
    }

    add(layer) {
        super.add(layer)
        layer._setCanvasSize(this.width(), this.height());
        layer.draw()
        this.content.appendChild(layer.canvas)
        return this 
    }

    _buildDOM() {
        var container = this.container() as HTMLElement
        if (typeof container === 'string') {
            container = document.getElementById('container') as HTMLElement
        }

        container.innerHTML = ''

        this.content = document.createElement('div');
        this.content.style.position = 'relative';
        this.content.style.userSelect = 'none';

        container.appendChild(this.content);

        this._resizeDOM();
    }

    _resizeDOM() {
        if (this.content) {

        }
    }
}