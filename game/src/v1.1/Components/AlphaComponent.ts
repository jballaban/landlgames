import { PreRenderComponent } from "./PreRenderComponent";
import { EventHandler } from "../Core/EventHandler";
import { Color } from "../Textures/Color";

export class AlphaComponent extends PreRenderComponent {

	public alpha: number = 1;

	public apply(ctx: CanvasRenderingContext2D) {
		ctx.globalAlpha *= this.alpha;
	}

}