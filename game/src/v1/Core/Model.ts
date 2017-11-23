import { Entity, Composer } from "./Entity";
import { Vector2D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";

export abstract class Model extends Entity {

	constructor() {
		super();
		this.attributes.set("alpha", 1);
		this.attributes.set("zIndex", 0);
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

	public draw(ctx: CanvasRenderingContext2D): void {
		let position: Vector2D = this.getCalculatedAttribute("origin", Composer.Vector2DAdd);
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