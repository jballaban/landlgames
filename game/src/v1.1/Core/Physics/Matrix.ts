import { Vector2D } from "../Vector";

export class Matrix {

	public m00: number;
	public m01: number;
	public m10: number;
	public m11: number;

	/**
	 * Sets this matrix to a rotation matrix with the given radians.
	 */
	public setRotation(radians: number): Matrix {
		let c: number = Math.cos(radians);
		let s: number = Math.sin(radians);

		this.m00 = c;
		this.m01 = -s;
		this.m10 = s;
		this.m11 = c;
		return this;
	}

	/**
	 * Sets the values of this matrix.
	 */
	public set(a: number, b: number, c: number, d: number): Matrix {
		this.m00 = a;
		this.m01 = b;
		this.m10 = c;
		this.m11 = d;
		return this;
	}

	/**
	 * Sets this matrix to have the same values as the given matrix.
	 */
	public clone(): Matrix {
		let m: Matrix = new Matrix();
		m.m00 = this.m00;
		m.m01 = this.m01;
		m.m10 = this.m10;
		m.m11 = this.m11;
		return m;
	}

	/**
	 * Sets the values of this matrix to their absolute value.
	 */
	public abs(): Matrix {
		this.m00 = Math.abs(this.m00);
		this.m01 = Math.abs(this.m01);
		this.m10 = Math.abs(this.m10);
		this.m11 = Math.abs(this.m11);
		return this;
	}

	/**
	 * Sets out to the x-axis (1st column) of this matrix.
	 */
	public getAxisX(): Vector2D {
		return new Vector2D(this.m00, this.m10);
	}

	/**
	 * Sets out to the y-axis (2nd column) of this matrix.
	 */
	public getAxisY(): Vector2D {
		return new Vector2D(this.m01, this.m11);
	}

	/**
	 * Sets the matrix to it's transpose.
	 */
	public transpose(): Matrix {
		let t: number = this.m01;
		this.m01 = this.m10;
		this.m10 = t;
		return this;
	}

	/**
	 * Sets out the to transformation of {x,y} by this matrix.
	 */
	public multiplyScalar(x: number, y: number): Vector2D {
		return new Vector2D(
			this.m00 * x + this.m01 * y,
			this.m10 * x + this.m11 * y
		);
	}

	/**
	 * Multiplies this matrix by x.
	 */
	public multiply(x: Matrix): Matrix {
		return this.set(
			this.m00 * x.m00 + this.m01 * x.m10,
			this.m00 * x.m01 + this.m01 * x.m11,
			this.m10 * x.m00 + this.m11 * x.m10,
			this.m10 * x.m01 + this.m11 * x.m11);
	}

}