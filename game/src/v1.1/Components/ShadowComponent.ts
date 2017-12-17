import { PreRenderComponent } from "./PreRenderComponent";
import { EventHandler } from "../Core/EventHandler";
import { Color } from "../Textures/Color";

export interface IShadowOptions {
	depth?: number;
	color?: Color;
}

export class ShadowComponent extends PreRenderComponent {

	public depth: number = 15;
	public color: Color = Color.Black;

	constructor(options?: IShadowOptions) {
		super();
		if (options && options.depth != null) { this.depth = options.depth; }
		if (options && options.color != null) { this.color = options.color; }
	}

	public init(ctx: CanvasRenderingContext2D): void {
		ctx.canvas.width += this.depth * 2;
		ctx.canvas.height += this.depth * 2;
		ctx.translate(this.depth, this.depth);
	}

	public apply(ctx: CanvasRenderingContext2D): void {
		ctx.shadowBlur = this.depth;
		ctx.shadowColor = this.color.toString();
	}

}