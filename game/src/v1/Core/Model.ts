import { Entity } from "./Entity";
import { Vector3D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";
import { Composer } from "../Foundation/Composer";
import { Camera } from "./Camera";

export abstract class Model extends Entity {

	constructor() {
		super();
		this.alpha = 1;
		this.layerIndex = 0;
	}

	public get layerIndex(): number { return this.getAttribute<number>("layerIndex"); }

	public set layerIndex(value: number) { this.setAttribute("layerIndex", value); }

	public get alpha(): number { return this.getAttribute<number>("alpha"); }

	public set alpha(value: number) {
		this.setAttribute("alpha", Math.min(1, value));
	}

	public getEffectiveAlpha(): number {
		return this.getEffectiveAttribute("alpha", Composer.NumberMultiply);
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

	public draw(ctx: CanvasRenderingContext2D, cameraOrigin: Vector3D, cameraScale: number, cameraRotateZ: number): void {
		let position: Vector3D = this.getEffectiveOrigin(cameraOrigin, cameraScale, cameraRotateZ);
		let angle: number = this.getEffectiveRotateZ(cameraRotateZ);
		ctx.save();
		if (this.getEffectiveAlpha() !== 1) {
			ctx.globalAlpha = this.getEffectiveAlpha();
		}
		ctx.translate(position.x, position.y);
		if (angle !== 0) {
			ctx.rotate(angle * Math.PI / 180);
		}
		let scale: number = this.getEffectiveScale(cameraScale);
		if (scale !== 1) {
			ctx.scale(scale, scale);
		}
		ctx.shadowBlur = 20;
		ctx.shadowColor = "rgb(0,0,0)";
		this.render(ctx);
		ctx.restore();
	}

}