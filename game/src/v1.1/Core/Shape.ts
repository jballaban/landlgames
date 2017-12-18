import { Body } from "./Body";

export enum ShapeType {
	Circle = 1,
	Polygon = 2
}

export abstract class Shape {
	public abstract type: ShapeType;
	public body: Body;
	public abstract width(): number;
	public abstract height(): number;
	public abstract centered(): boolean;
	public abstract render(ctx: CanvasRenderingContext2D): void;
	public abstract initialize(): void;
	public abstract setOrient(radians: number): void;
}

export class Circle extends Shape {
	constructor(public r: number) {
		super();
	}
	public initialize(): void {
		// this.computeMass(1);
	}
	public type: ShapeType = ShapeType.Circle;
	public width(): number { return this.r * 2; }
	public height(): number { return this.r * 2; }
	public centered(): boolean { return true; }
	public render(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(Math.floor(this.r), Math.floor(this.r), Math.floor(this.r), 0, 2 * Math.PI);
		ctx.clip();
	}
	public setOrient(radians: number): void {
		// do nothing
	}
}

export class Rectangle extends Shape {
	constructor(public w: number, public h: number) {
		super();
	}
	public initialize(): void {
		// this.computeMass(1);
	}
	public type: ShapeType = ShapeType.Polygon;
	public width(): number { return this.w; }
	public height(): number { return this.h; }
	public centered(): boolean { return false; }
	public render(ctx: CanvasRenderingContext2D): void { }
	public setOrient(radians: number): void {
		// todo
	}
}