const HASH = "#"
const ZERO = "0"
export const shapes = {}
export const Util = {
    getRandomColor() {
        var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = ZERO + randColor;
        }
        return HASH + randColor;
    },
    getColorKey() {
        let key
        while (true) {
            key = Util.getRandomColor();
            if (key && !(key in shapes)) {
                break
            }
        }
        return key
    },
    _rgbToHex(r: number, g: number, b: number) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    _capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    _isFunction(obj: any) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    isObject(val: any): val is Object {
        return val instanceof Object;
    }
}