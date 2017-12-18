import { Body } from "./Physics/Body";

export abstract class Shape {
	public abstract width(): number;
	public abstract height(): number;
	public abstract centered(): boolean;
	public abstract render(ctx: CanvasRenderingContext2D): void;
}

export class Circle extends Shape {
	constructor(public r: number) {
		super();
	}
	public width(): number { return this.r * 2; }
	public height(): number { return this.r * 2; }
	public centered(): boolean { return true; }
	public color: string;
	public render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(Math.floor(this.r), Math.floor(this.r), Math.floor(this.r), 0, 2 * Math.PI);
		ctx.clip();
		ctx.fillRect(0, 0, this.width(), this.height());
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