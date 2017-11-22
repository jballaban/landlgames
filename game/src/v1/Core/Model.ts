import { Entity, Composer } from "./Entity";
import { Vector2D } from "./Vector";
import { Logger } from "../Util/Logger";

export interface RenderOptions {
	alpha: number;
	position: Vector2D;
}

export abstract class Model extends Entity {

	constructor() {
		super();
		this.attributes.set("alpha", 1);
	}

	public abstract render(ctx: CanvasRenderingContext2D, options: RenderOptions): void;

	public draw(ctx: CanvasRenderingContext2D): void {
		this.render(ctx, {
			alpha: this.getCalculatedAttribute("alpha", Composer.NumberMultiply),
			position: this.getCalculatedAttribute("origin", Composer.Vector2DAdd)
		});
	}

}