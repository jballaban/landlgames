import { Body } from "./Physics/Body";
import { Vector2D } from "./Vector";
import { Matrix } from "./Physics/Matrix";
import { Logger } from "../Utils/Logger";

export abstract class Shape {
	public abstract width(): number;
	public abstract height(): number;
	public abstract centered(): boolean;
	public abstract render(ctx: CanvasRenderingContext2D): void;
}

export class Circle extends Shape {
	public color: string;
	constructor(public r: number) {
		super();
	}

	public width(): number { return this.r * 2; }
	public height(): number { return this.r * 2; }
	public centered(): boolean { return true; }

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(Math.floor(this.r), Math.floor(this.r), Math.floor(this.r), 0, 2 * Math.PI);
		ctx.clip();
		ctx.fillRect(0, 0, this.width(), this.height());
	}
}

export class Polygon extends Shape {
	public static MAX_POLY_VERTEX_COUNT: number = 64;
	public vertexCount: number;
	public vertices: Vector2D[] = Vector2D.arrayOf(Polygon.MAX_POLY_VERTEX_COUNT);
	public color: string;
	public u: Matrix = new Matrix();

	public width(): number {
		let max: number = Number.MIN_VALUE;
		for (let i: number = 0; i < this.vertexCount; i++) {
			let v: Vector2D = this.vertices[i].clone().multiplyMatrix(this.u);
			max = Math.max(max, v.x);
		}
		return max;
	}

	public height(): number {
		let max: number = Number.MIN_VALUE;
		for (let i: number = 0; i < this.vertexCount; i++) {
			let v: Vector2D = this.vertices[i].clone().multiplyMatrix(this.u);
			max = Math.max(max, v.y);
		}
		return max;
	}

	public centered(): boolean { return false; }

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		for (let i: number = 0; i < this.vertexCount; i++) {
			let v: Vector2D = this.vertices[i].clone().multiplyMatrix(this.u);
			if (i === 0) {
				ctx.moveTo(v.x, v.y);
			} else {
				ctx.lineTo(v.x, v.y);
			}
		}
		ctx.closePath();
		ctx.fill();
	}
}

export class Rectangle extends Shape {
	constructor(public w: number, public h: number) {
		super();
	}
	public width(): number { return this.w; }
	public height(): number { return this.h; }
	public centered(): boolean { return false; }
	public render(ctx: CanvasRenderingContext2D): void {
		// todo
	}
}