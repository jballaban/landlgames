import { Entity, Composer } from "./Entity";
import { Model } from "./Model";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";
import { Vector3D } from "./Vector";

export class Camera extends Entity {
	constructor(z: number) {
		super();
		this.origin.z = z;
	}

	public draw(viewport: Viewport, ctx: CanvasRenderingContext2D, models: Model[]): void {
		models.sort(function (a: Model, b: Model): number {
			let aindex = a.effectiveOrigin.z;
			let bindex = b.effectiveOrigin.z;
			return aindex - bindex;
		});
		ctx.save();
		ctx.translate(viewport.width / 2, viewport.height / 2);
		ctx.rotate(this.rotateZ * Math.PI / 180);
		ctx.scale(this.scale, this.scale);
		ctx.translate(-viewport.width / 2, -viewport.height / 2);
		for (let i = 0; i < models.length; i++) {
			let distance = this.origin.z - models[i].effectiveOrigin.z;
			if (distance > 0) {
				models[i].draw(ctx);
			}
		}
		ctx.restore();
	}

}