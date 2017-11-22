import { Entity, Composer } from "./Entity";
import { Vector2D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";

export interface RenderOptions {
	alpha: number;
	x: number;
	y: number
	rotateZ: number;
	rotationX: number;
	rotationY: number;
}

export abstract class Model extends Entity {

	constructor() {
		super();
		this.attributes.set("alpha", 1);
	}

	public abstract render(ctx: CanvasRenderingContext2D, options: RenderOptions): void;

	public draw(ctx: CanvasRenderingContext2D): void {
		let position: Vector2D = this.getCalculatedAttribute("origin", Composer.Vector2DAdd);
		let rotationCenter: Vector2D = this.getCalculatedAttribute("rotationCenter", Composer.Latest);
		if (rotationCenter == null) {
			rotationCenter = position;
		} else {
			rotationCenter = rotationCenter.clone().add(position);
		}
		let angle: number = this.getCalculatedAttribute<number>("rotateZ", Composer.NumberAdd);
		if (angle != 0)
			Logger.log(angle);
		let options: RenderOptions = {
			alpha: this.getCalculatedAttribute("alpha", Composer.NumberMultiply),
			x: Math.floor(position.x),
			y: Math.floor(position.y),
			rotateZ: angle * Math.PI / 180,
			rotationX: rotationCenter.x,
			rotationY: rotationCenter.y
		};

		this.render(ctx, options);
	}

}