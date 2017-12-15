import { PreRenderComponent } from "./PreRenderComponent";
import { EventHandler } from "../Core/EventHandler";
import { Color } from "../Textures/Color";

export interface IAlphaOptions {
	alpha?: number;
}

export class AlphaComponent extends PreRenderComponent {

	constructor(options?: IAlphaOptions) {
		super();
		if (options && options.alpha != null) {
			this.alpha = options.alpha;
		}
	}

	public alpha: number = 1;

	public apply(ctx: CanvasRenderingContext2D) {
		if (this.alpha === 1) { return; }
		ctx.globalAlpha *= this.alpha;
	}

}