export class Transform {
    m: Array<number>;
    constructor(m = [1, 0, 0, 1, 0, 0]) {
      this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    /**
     * Copy Konva.Transform object
     * @method
     * @name Konva.Transform#copy
     * @returns {Konva.Transform}
     * @example
     * const tr = shape.getTransform().copy()
     */
    copy() {
      return new Transform(this.m);
    }
    /**
     * Transform point
     * @method
     * @name Konva.Transform#point
     * @param {Object} point 2D point(x, y)
     * @returns {Object} 2D point(x, y)
     */
    point(point) {
      var m = this.m;
      return {
        x: m[0] * point.x + m[2] * point.y + m[4],
        y: m[1] * point.x + m[3] * point.y + m[5]
      };
    }
    /**
     * Apply translation
     * @method
     * @name Konva.Transform#translate
     * @param {Number} x
     * @param {Number} y
     * @returns {Konva.Transform}
     */
    translate(x: number, y: number) {
      this.m[4] += this.m[0] * x + this.m[2] * y;
      this.m[5] += this.m[1] * x + this.m[3] * y;
      return this;
    }
    /**
     * Apply scale
     * @method
     * @name Konva.Transform#scale
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    scale(sx: number, sy: number) {
      this.m[0] *= sx;
      this.m[1] *= sx;
      this.m[2] *= sy;
      this.m[3] *= sy;
      return this;
    }
    /**
     * Apply rotation
     * @method
     * @name Konva.Transform#rotate
     * @param {Number} rad  Angle in radians
     * @returns {Konva.Transform}
     */
    rotate(rad: number) {
      var c = Math.cos(rad);
      var s = Math.sin(rad);
      var m11 = this.m[0] * c + this.m[2] * s;
      var m12 = this.m[1] * c + this.m[3] * s;
      var m21 = this.m[0] * -s + this.m[2] * c;
      var m22 = this.m[1] * -s + this.m[3] * c;
      this.m[0] = m11;
      this.m[1] = m12;
      this.m[2] = m21;
      this.m[3] = m22;
      return this;
    }
    /**
     * Returns the translation
     * @method
     * @name Konva.Transform#getTranslation
     * @returns {Object} 2D point(x, y)
     */
    getTranslation() {
      return {
        x: this.m[4],
        y: this.m[5]
      };
    }
    /**
     * Apply skew
     * @method
     * @name Konva.Transform#skew
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    skew(sx: number, sy: number) {
      var m11 = this.m[0] + this.m[2] * sy;
      var m12 = this.m[1] + this.m[3] * sy;
      var m21 = this.m[2] + this.m[0] * sx;
      var m22 = this.m[3] + this.m[1] * sx;
      this.m[0] = m11;
      this.m[1] = m12;
      this.m[2] = m21;
      this.m[3] = m22;
      return this;
    }
    /**
     * Transform multiplication
     * @method
     * @name Konva.Transform#multiply
     * @param {Konva.Transform} matrix
     * @returns {Konva.Transform}
     */
    multiply(matrix: Transform) {
      var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
      var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
  
      var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
      var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
  
      var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
      var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
  
      this.m[0] = m11;
      this.m[1] = m12;
      this.m[2] = m21;
      this.m[3] = m22;
      this.m[4] = dx;
      this.m[5] = dy;
      return this;
    }
    /**
     * Invert the matrix
     * @method
     * @name Konva.Transform#invert
     * @returns {Konva.Transform}
     */
    invert() {
      var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
      var m0 = this.m[3] * d;
      var m1 = -this.m[1] * d;
      var m2 = -this.m[2] * d;
      var m3 = this.m[0] * d;
      var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
      var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      this.m[0] = m0;
      this.m[1] = m1;
      this.m[2] = m2;
      this.m[3] = m3;
      this.m[4] = m4;
      this.m[5] = m5;
      return this;
    }
    /**
     * return matrix
     * @method
     * @name Konva.Transform#getMatrix
     */
    getMatrix() {
      return this.m;
    }
    /**
     * set to absolute position via translation
     * @method
     * @name Konva.Transform#setAbsolutePosition
     * @returns {Konva.Transform}
     * @author ericdrowell
     */
    setAbsolutePosition(x: number, y: number) {
      var m0 = this.m[0],
        m1 = this.m[1],
        m2 = this.m[2],
        m3 = this.m[3],
        m4 = this.m[4],
        m5 = this.m[5],
        yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2),
        xt = (x - m4 - m2 * yt) / m0;
  
      return this.translate(xt, yt);
    }
  }