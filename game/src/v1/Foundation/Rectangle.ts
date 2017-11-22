import { IShape } from "./IShape";
import { Logger } from "../Util/Logger";
import { Vector2D } from "../Core/Vector";

export class Rectangle implements IShape {
	public bottom: number;
	public middle: number;

	constructor(
		private offsetX: number,
		private offsetY: number,
		public w: number,
		public h: number
	) {
		this.bottom = offsetY + h;
		this.middle = offsetX + w / 2;
	}

	public draw(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
		ctx.fillStyle = color;
		ctx.fillRect(x + this.offsetX, y + this.offsetY, this.w, this.h);
	}

}