import { INodeConfig } from './interfaces/INodeConfig';
import { Util } from './Util';
const SET = 'set'
let idCounter = 1
export abstract class Node<Config extends INodeConfig = INodeConfig> {
    _id = idCounter++
    parent: any
    attrs: any = {}

    constructor(config?: Config) {
        this.setAttrs(config)
    }

    abstract drawScene(): void

    draw() {
        this.drawScene()
    }

    // 一直向上找， Layer中会重写该方法，返回 this
    getLayer() {
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

    getParent() {
        return this.parent
    }

    width() {
        return this.attrs.width
    }

    height() {
        return this.attrs.height
    }
}