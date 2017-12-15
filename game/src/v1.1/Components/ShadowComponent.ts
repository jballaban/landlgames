import { PreRenderComponent } from "./PreRenderComponent";
import { EventHandler } from "../Core/EventHandler";
import { Color } from "../Textures/Color";

export class ShadowComponent extends PreRenderComponent {

	public depth: number = 15;
	public color: Color = Color.Black;

	public apply(ctx: CanvasRenderingContext2D) {
		ctx.canvas.width += this.depth * 2;
		ctx.canvas.height += this.depth * 2;
		ctx.translate(this.depth, this.depth);
		ctx.shadowBlur = this.depth;
		ctx.shadowColor = this.color.toString();
	}

}