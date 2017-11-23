import { Entity, Composer } from "./Entity";
import { Vector3D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";

export abstract class Model extends Entity {

	constructor() {
		super();
		this.alpha = 1;
	}

	public get alpha(): number {
		return this.getAttribute<number>("alpha");
	}

	public set alpha(value: number) {
		this.setAttribute("alpha", Math.min(1, value));
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

	public draw(ctx: CanvasRenderingContext2D): void {
		let position: Vector3D = this.effectiveOrigin;
		let angle: number = this.getCalculatedAttribute("rotateZ", Composer.NumberAdd);
		ctx.save();
		ctx.globalAlpha = this.getCalculatedAttribute("alpha", Composer.NumberMultiply);
		ctx.translate(position.x, position.y);
		if (angle !== 0) {
			ctx.rotate(angle * Math.PI / 180);
		}
		let scale = this.getCalculatedAttribute<number>("scale", Composer.NumberMultiply);
		if (scale !== 1) {
			ctx.scale(scale, scale);
		}
		ctx.shadowBlur = 20;
		ctx.shadowColor = "rgb(0,0,0)";
		this.render(ctx);
		ctx.restore();
	}

}