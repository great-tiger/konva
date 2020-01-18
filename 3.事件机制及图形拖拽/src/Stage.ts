import { IStageConfig } from './interfaces/IStageConfig';
import { Container } from "./Container";
import { BaseLayer } from "./BaseLayer";

const EVENTS = [
    'mousedown',
    'mousemove',
    'mouseup'
]
export class Stage extends Container<BaseLayer> {
    content: HTMLDivElement
    _pointerPosition: any
    constructor(config: IStageConfig) {
        super(config)
        this._buildDOM()
        this._bindContentEvents()
    }

    _addEvent(ctx, eventName) {
        this.content.addEventListener(
            eventName,
            function (evt) {
                ctx[`_${eventName}`](evt)
            },
            false
        )
    }

    _bindContentEvents() {
        for (var n = 0; n < EVENTS.length; n++) {
            var eventName = EVENTS[n]
            this._addEvent(this, eventName)
        }
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

    setPointersPositions(evt) {
        var rect = this.content.getBoundingClientRect()
        this._pointerPosition = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        }
    }

    getPointerPosition() {
        return this._pointerPosition
    }

    getIntersection(pos) {
        if (!pos) {
            return null;
        }
        var layers = this.children,
            len = layers.length,
            end = len - 1,
            n,
            shape;

        for (n = end; n >= 0; n--) {
            shape = layers[n].getIntersection(pos);
            if (shape) {
                return shape;
            }
        }

        return null;
    }

    _mousedown(evt) {
        this.setPointersPositions(evt)
        let shape = this.getIntersection(this.getPointerPosition())
        if (shape) {
            shape._fireAndBubble('mousedown', { evt: evt })
        }
    }

    _mousemove(evt) {
        this.setPointersPositions(evt)
        let shape = this.getIntersection(this.getPointerPosition())
        if (shape) {
            shape._fireAndBubble('mousemove', { evt: evt })
        }
    }

    _mouseup(evt) {
        this.setPointersPositions(evt)
        let shape = this.getIntersection(this.getPointerPosition())
        if (shape) {
            shape._fireAndBubble('mouseup', { evt: evt })
        }
    }
}