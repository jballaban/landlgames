import { IShape } from "./IShape";

export class Circle implements IShape {
	constructor(
		public r: number
	) { }

	public draw(ctx: CanvasRenderingContext2D, color: string): void {
		ctx.beginPath();
		ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
		ctx.fill();
	}

}