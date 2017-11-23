import { IShape } from "./IShape";
import { Logger } from "../Util/Logger";

export class Rectangle implements IShape {
	public get bottom(): number {
		return this.offsetY + this.h;
	}
	public get centerX(): number {
		return this.offsetX + this.w / 2;
	}
	public get centerY(): number {
		return this.offsetY + this.h / 2;
	}
	public get top(): number {
		return this.offsetY;
	}
	public get right(): number {
		return this.offsetX + this.w;
	}

	constructor(
		private offsetX: number,
		private offsetY: number,
		public w: number,
		public h: number
	) { }

	public draw(ctx: CanvasRenderingContext2D, color: string): void {
		ctx.fillStyle = color;
		ctx.fillRect(this.offsetX, this.offsetY, this.w, this.h);
	}

}