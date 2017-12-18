import { S_IFBLK } from "constants";
import { ImpulseMath } from "./ImpulseMath";


export class Vector2D {

	constructor(
		public x: number = 0,
		public y: number = 0
	) { }

	public set(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	public clone(): Vector2D { return new Vector2D(this.x, this.y); }

	public negate(): Vector2D {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	public multiplyScalar(s: number): Vector2D {
		this.x *= s;
		this.y *= s;
		return this;
	}

	public divideScalar(s: number): Vector2D {
		this.x /= s;
		this.y /= s;
		return this;
	}

	public addScalar(s: number): Vector2D {
		this.x += s;
		this.y += s;
		return this;
	}

	public multiply(v: Vector2D): Vector2D {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}

	public divide(v: Vector2D): Vector2D {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	}

	public add(v: Vector2D): Vector2D {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	public addVectorWithScalar(v: Vector2D, s: number): Vector2D {
		this.add(v.clone().multiplyScalar(s));
		return this;
	}

	public subtract(v: Vector2D): Vector2D {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	public lengthSquared(): number {
		return this.x * this.x + this.y * this.y;
	}

	public length(): number {
		return Math.sqrt(this.lengthSquared());
	}

	public rotate(r: number): Vector2D {
		let c: number = Math.cos(r);
		let s: number = Math.sin(r);
		let xp: number = this.x * c - this.y * s;
		let yp: number = this.x * s + this.y * c;
		this.x = xp;
		this.y = yp;
		return this;
	}

	public normalize(): Vector2D {
		let lenSq: number = this.lengthSquared();
		if (lenSq > ImpulseMath.EPSILON_SQ) {
			let invLen: number = 1 / Math.sqrt(lenSq);
			this.x *= invLen;
			this.y *= invLen;
		}
		return this;
	}

	public minimum(v: Vector2D): Vector2D {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		return this;
	}

	public maximum(v: Vector2D): Vector2D {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		return this;
	}

	public dot(v: Vector2D): number {
		return this.x * v.x + this.y * v.y;
	}

	public distanceSquared(v: Vector2D): number {
		let dx: number = this.x - v.x;
		let dy: number = this.y - v.y;
		return dx * dx + dy * dy;
	}

	public distance(v: Vector2D): number {
		let dx: number = this.x - v.x;
		let dy: number = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	public crossWithScalar(v: Vector2D, a: number): Vector2D {
		let dx: number = v.y * a;
		let dy: number = v.x * -a;
		this.x = dx;
		this.y = dy;
		return this;
	}

	public cross(v: Vector2D): number {
		return this.x * v.y - this.y * v.x;
	}

	public crossScalar(a: number): Vector2D {
		let dx: number = this.y * -a;
		let dy: number = this.x * a;
		this.x = dx;
		this.y = dy;
		return this;
	}

	public static arrayOf(len: number): Vector2D[] {
		let result: Vector2D[] = new Array<Vector2D>();
		while (--len >= 0) {
			result[len] = new Vector2D();
		}
		return result;
	}

}