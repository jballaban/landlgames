import { Entity, Composer } from "./Entity";
import { Vector2D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";

export abstract class Model extends Entity {

	constructor() {
		super();
		this.attributes.set("alpha", 1);
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

	public draw(ctx: CanvasRenderingContext2D): void {
		let position: Vector2D = this.getCalculatedAttribute("origin", Composer.Vector2DAdd);
		let angle: number = this.getCalculatedAttribute("rotateZ", Composer.NumberAdd);
		ctx.save();
		ctx.globalAlpha = this.getCalculatedAttribute("alpha", Composer.NumberMultiply);
		ctx.translate(position.x, position.y);
		ctx.rotate(angle * Math.PI / 180);
		this.render(ctx);
		ctx.restore();
	}

}