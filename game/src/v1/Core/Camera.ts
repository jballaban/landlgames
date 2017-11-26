import { Entity, IUpdate } from "./Entity";
import { Model } from "./Model";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";
import { Vector3D } from "./Vector";

export class Camera extends Entity implements IUpdate {
	constructor() {
		super();
		this.cameraScale = 1;
		this.cameraRotateZ = 0;
	}

	public get cameraScale(): number {
		return this.getAttribute<number>("cameraScale");
	}

	public set cameraScale(value: number) {
		this.setAttribute("cameraScale", value);
		this.setAttribute("scale", 1 / value);
	}

	public get cameraRotateZ(): number {
		return this.getAttribute<number>("cameraRotateZ");
	}

	public set cameraRotateZ(value: number) {
		this.setAttribute("cameraRotateZ", value);
		this.setAttribute("rotateZ", -value);
	}

	public draw(viewport: Viewport, ctx: CanvasRenderingContext2D, models: Model[]): void {
		//ctx.save();
		//ctx.translate(this.origin.x, this.origin.y);
		if (this.rotateZ !== 0) {
			//	ctx.rotate(this.rotateZ * Math.PI / 180);
		}
		if (this.scale !== 1) {
			//		ctx.scale(this.scale, this.scale);
		}
		for (let i: number = 0; i < models.length; i++) {
			models[i].draw(ctx, this);
		}
		//	ctx.translate(-this.origin.x, -this.origin.y);
		//	ctx.restore();
	}

	public update(): void {
		//this.cameraRotateZ += 1;
	}

}