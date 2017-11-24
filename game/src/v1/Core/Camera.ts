import { Entity, Composer } from "./Entity";
import { Model } from "./Model";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";
import { Vector3D } from "./Vector";

export class Camera extends Entity {
	constructor(z: number) {
		super();
		this.origin.z = z;
		this.scale = 0.5;
	}

	public draw(viewport: Viewport, ctx: CanvasRenderingContext2D, models: Model[]): void {
		ctx.save();
		ctx.translate(viewport.width / 2, viewport.height / 2);
		if (this.rotateZ !== 0) {
			ctx.rotate(this.rotateZ * Math.PI / 180);
		}
		if (this.scale !== 1) {
			ctx.scale(this.scale, this.scale);
		}
		ctx.translate(-viewport.width / 2, -viewport.height / 2);
		for (let i: number = 0; i < models.length; i++) {
			if (this.origin.z - models[i].effectiveOrigin.z > 0) {
				models[i].draw(ctx);
			}
		}
		ctx.restore();
	}

}