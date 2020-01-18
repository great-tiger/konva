import { INodeConfig } from './interfaces/INodeConfig';
import { Util } from './Util';
import { BaseLayer } from './BaseLayer';
import { DD } from './Drag'
import { Transform } from './Transform';
const SET = 'set'
let idCounter = 1
export abstract class Node<Config extends INodeConfig = INodeConfig> {
    _id = idCounter++
    parent: any
    attrs: any = {}

    eventListeners: {
        [index: string]: Array<{ name: string; handler: Function }>
    } = {}

    constructor(config?: Config) {
        this.setAttrs(config)
        if (this.attrs.draggable) {
            this._listenDrag()
        }
    }

    _listenDrag() {
        this._dragCleanup() // 移除事件
        this.on('mousedown', function (evt) {
            this._createDragElement(evt)
        })
    }

    _dragCleanup() {
        this.off('mousedown')
    }

    _createDragElement(evt) {
        var ap = this.getLayer().getParent().getPointerPosition()
        DD._dragElements.set(this._id, {
            node: this,
            startPointerPos: ap,
            offset: {
                x: ap.x - this.x(),
                y: ap.y - this.y()
            },
            dragStatus: 'ready'
        })
    }
    startDrag(evt?: any) {
        const elem = DD._dragElements.get(this._id)
        elem.dragStatus = 'dragging'
    }
    _setDragPosition(evt, elem) {
        const pos = this.getLayer().getParent().getPointerPosition()
        this.setX(pos.x - elem.offset.x)
        this.setY(pos.y - elem.offset.y)
        this.getLayer().batchDraw()
    }

    abstract drawScene(): void
    abstract drawHit(): void

    draw() {
        this.drawScene()
        this.drawHit()
    }

    _fireAndBubble(eventType, evt) {
        this._fire(eventType, evt)
        if (!evt.cancelBubble && this.parent) {
        }
    }

    _fire(eventType, evt) {
        let events = this.eventListeners[eventType]
        if (events) {
            evt = evt || {}
            evt.currentTarget = this;
            evt.type = eventType
            for (let i = 0; i < events.length; i++) {
                events[i].handler.call(this, evt)
            }
        }
    }

    on(eventType, handler) {
        let events = this.eventListeners[eventType]
        if (!events) {
            events = this.eventListeners[eventType] = []
        }
        events.push({
            name: '',
            handler: handler
        })
    }

    off(eventType) {
        delete this.eventListeners[eventType]
    }

    // 一直向上找， Layer中会重写该方法，返回 this
    getLayer(): BaseLayer {
        var parent = this.getParent()
        return parent ? parent.getLayer() : null
    }

    setAttrs(config: Config) {
        var key, method;

        if (!config) {
            return this;
        }
        for (key in config) {
            method = SET + Util._capitalize(key);
            if (Util._isFunction(this[method])) {
                this[method](config[key]);
            } else {
                this._setAttr(key, config[key]);
            }
        }
        return this;
    }

    _setAttr(key, val) {
        var oldVal = this.attrs[key];
        if (oldVal === val && !Util.isObject(val)) {
            return;
        }
        if (val === undefined || val === null) {
            delete this.attrs[key];
        } else {
            this.attrs[key] = val;
        }
    }

    getTransform(): Transform {
        let m = new Transform(),
            x = this.getX(),
            y = this.getY(),
            rotation = this.getRotation() * Math.PI / 180,
            scaleX = this.getScaleX(),
            scaleY = this.getScaleY(),
            offsetX = this.getOffsetX(),
            offsetY = this.getOffsetY()
        if (x !== 0 || y !== 0) {
            m.translate(x, y);
        }
        if (rotation !== 0) {
            m.rotate(rotation);
        }

        if (scaleX !== 1 || scaleY !== 1) {
            m.scale(scaleX, scaleY);
        }
        if (offsetX !== 0 || offsetY !== 0) {
            m.translate(-1 * offsetX, -1 * offsetY);
        }
        return m
    }

    getAbsoluteTransform() {
        return this._getAbsoluteTransform()
    }

    _getAbsoluteTransform() {
        let at = new Transform()
        this._eachAncestorReverse(function (node: Node<Config>) {
            at.multiply(node.getTransform())
        })
        return at
    }

    _eachAncestorReverse(func) {
        var family = [],
            parent = this.getParent(),
            len,
            n;

        family.unshift(this);

        while (parent) {
            family.unshift(parent);
            parent = parent.parent;
        }

        len = family.length;
        for (n = 0; n < len; n++) {
            func(family[n]);
        }
    }
    
    getParent() {
        return this.parent
    }

    x() {
        return this.attrs.x
    }

    setX(val) {
        this.attrs.x = val
    }

    setY(val) {
        this.attrs.y = val
    }

    y() {
        return this.attrs.y
    }

    width() {
        return this.attrs.width
    }

    height() {
        return this.attrs.height
    }

    getX() {
        return this.attrs.x || 0
    }

    getY() {
        return this.attrs.y || 0
    }

    getScaleX() {
        return this.attrs.scaleX || 1
    }

    setScaleX(val: number) {
        this.attrs.scaleX = val
    }

    getScaleY() {
        return this.attrs.scaleY || 1
    }

    setScaleY(val: number) {
        this.attrs.scaleY = val
    }

    getOffsetX() {
        return this.attrs.offsetX || 0
    }

    setOffsetX(val: number) {
        this.attrs.offsetX = val
    }

    getOffsetY() {
        return this.attrs.offsetY || 0
    }

    setOffsetY(val: number) {
        this.attrs.offsetY = val
    }

    getRotation() {
        return this.attrs.rotation || 0
    }

    setRotation(val: number) {
        this.attrs.rotation = val
    }
}