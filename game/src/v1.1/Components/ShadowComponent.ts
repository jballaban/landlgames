import { PreRenderComponent } from "./PreRenderComponent";
import { EventHandler } from "../Core/EventHandler";

export class ShadowComponent extends PreRenderComponent {

	public apply(ctx: CanvasRenderingContext2D) {
		ctx.shadowBlur = 5;
		ctx.shadowColor = "rgb(0,0,0)";
	}

}