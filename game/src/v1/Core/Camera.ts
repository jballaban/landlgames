import { Entity } from "./Entity";
import { Model } from "./Model";

export class Camera extends Entity {

	public draw(ctx: CanvasRenderingContext2D, models: Model[]) {
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		for (let i = 0; i < models.length; i++) {
			models[i].draw(ctx);
		}
	}

	public update(seconds: number): void {

	}
}