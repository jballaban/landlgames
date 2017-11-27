import { Entity, IUpdate } from "./Entity";
import { Model } from "./Model";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";
import { Vector3D } from "./Vector";
import { Component } from "./Component";
import { Time } from "./Time";

export class Camera extends Entity {
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

	public draw(viewport: Viewport, ctx: CanvasRenderingContext2D, models: Model[], hud: boolean): void {
		if (hud) {
			ctx.translate(-this.origin.x, -this.origin.y);
			for (let i: number = 0; i < models.length; i++) {
				models[i].draw(ctx, this.origin, 1, 0);
			}
			ctx.translate(this.origin.x, this.origin.y);
		} else {
			ctx.translate(-this.origin.x, -this.origin.y);
			for (let i: number = 0; i < models.length; i++) {
				models[i].draw(ctx, this.origin, this.cameraScale, this.cameraRotateZ);
			}
			ctx.translate(this.origin.x, this.origin.y);
		}
	}

	public update() {
		//	this.cameraRotateZ += 10 * Time.delta;
		//	Logger.log(this.cameraScale);
	}
}