import { Entity, Composer } from "./Entity";
import { Vector3D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";

export abstract class Model extends Entity {

	constructor() {
		super();
		this.alpha = 1;
		this.setAttribute("drawChanged", true);
	}

	public get drawChanged(): boolean {
		return this.positionChanged || this.getCalculatedAttribute<boolean>("drawChanged", Composer.BooleanOr);
	}

	public set drawChanged(value: boolean) {
		this.setAttribute("drawChanged", true);
	}

	public get alpha(): number { return this.getAttribute<number>("alpha"); }

	public set alpha(value: number) {
		this.drawChanged = true;
		this.setAttribute("alpha", Math.min(1, value));
	}

	public get effectiveAlpha(): number {
		if (this.drawChanged) {
			this.setAttribute("effectiveAlpha", this.getCalculatedAttribute<number>("alpha", Composer.NumberMultiply));
		}
		return this.getAttribute<number>("effectiveAlpha");
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

	public draw(ctx: CanvasRenderingContext2D): void {
		let position: Vector3D = this.effectiveOrigin;
		let angle: number = this.getCalculatedAttribute("rotateZ", Composer.NumberAdd);
		ctx.save();
		if (this.effectiveAlpha !== 1) {
			ctx.globalAlpha = this.effectiveAlpha;
		}
		ctx.translate(position.x, position.y);
		if (angle !== 0) {
			ctx.rotate(angle * Math.PI / 180);
		}
		let scale: number = this.getCalculatedAttribute<number>("scale", Composer.NumberMultiply);
		if (scale !== 1) {
			ctx.scale(scale, scale);
		}
		ctx.shadowBlur = 20;
		ctx.shadowColor = "rgb(0,0,0)";
		this.render(ctx);
		ctx.restore();
	}

}