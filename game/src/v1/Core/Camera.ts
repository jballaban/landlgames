import { Entity, IUpdate } from "./Entity";
import { Model } from "./Model";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";
import { Vector3D } from "./Vector";
import { Component, RenderComponent } from "./Component";
import { Time } from "./Time";



export class Camera extends Entity {

	public draw(ctx: CanvasRenderingContext2D, models: Model[]): void {
		ctx.translate(-this.origin.x, -this.origin.y);
		for (let i: number = 0; i < models.length; i++) {
			models[i].getComponent<RenderComponent>(RenderComponent).draw(ctx, this.origin, new Vector3D(this.scale, this.scale, 1), new Vector3D(0, 0, this.rotateZ));
		}
		ctx.translate(this.origin.x, this.origin.y);
	}
}
