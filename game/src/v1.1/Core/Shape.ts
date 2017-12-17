import { Vector3D } from "./Vector";

export abstract class Shape {
	public abstract bottom(): number;
	public abstract left(): number;
	public abstract top(): number;
	public abstract right(): number;
	public abstract centered(): boolean;
	public abstract render(ctx: CanvasRenderingContext2D): void;
}

export class Circle extends Shape {
	constructor(public r: number) {
		super();
	}
	public left(): number { return -this.r; }
	public top(): number { return -this.r; }
	public bottom(): number { return this.r; }
	public right(): number { return this.r; }
	public centered(): boolean { return true; }
	public render(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(Math.floor(this.r), Math.floor(this.r), Math.floor(this.r), 0, 2 * Math.PI);
		ctx.clip();
	}
}

export class Rectangle extends Shape {
	constructor(public w: number, public h: number) {
		super();
	}
	public left(): number { return -this.w / 2; }
	public top(): number { return -this.h / 2; }
	public bottom(): number { return this.h / 2; }
	public right(): number { return this.w / 2; }
	public centered(): boolean { return false; }
	public render(ctx: CanvasRenderingContext2D): void { }
}