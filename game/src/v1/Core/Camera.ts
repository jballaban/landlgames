import { Entity, Composer } from "./Entity";
import { Model } from "./Model";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";

export class Camera extends Entity {

	public draw(viewport: Viewport, ctx: CanvasRenderingContext2D, models: Model[]) {
		models.sort(function (a: Model, b: Model): number {
			let aindex = a.getCalculatedAttribute<number>("zIndex", Composer.NumberAdd);
			let bindex = b.getCalculatedAttribute<number>("zIndex", Composer.NumberAdd);
			return aindex - bindex;
		});
		ctx.save();
		ctx.translate(viewport.width / 2, viewport.height / 2);
		ctx.rotate(this.attributes.get("rotateZ") * Math.PI / 180);
		ctx.scale(this.attributes.get("scale"), this.attributes.get("scale"));
		ctx.translate(-viewport.width / 2, -viewport.height / 2);
		for (let i = 0; i < models.length; i++) {
			models[i].draw(ctx);
		}
		ctx.restore();
	}

	public update(seconds: number): void {
		let angle = this.attributes.get("rotateZ");
		angle += 0.5;
		if (angle > 360) {
			angle = 0;
		}
		this.attributes.set("rotateZ", angle);
	}
}