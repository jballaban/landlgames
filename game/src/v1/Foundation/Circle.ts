import { IShape } from "./IShape";

export class Circle implements IShape {
	constructor(
		public r: number
	) { }

	public draw(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, this.r, 0, 2 * Math.PI);
		ctx.fill();
	}

}