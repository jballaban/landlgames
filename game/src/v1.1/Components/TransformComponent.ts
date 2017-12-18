import { Component } from "../Core/Component";
import { Vector2D } from "../Core/Vector";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";
import { PreRenderComponent } from "./PreRenderComponent";

export interface TranslateOptions {
	origin: boolean;
	scale: boolean;
	rotate: boolean;
}

export class TransformComponent extends Component {
	public origin: Vector2D = new Vector2D();
	public scale: Vector2D = new Vector2D(1, 1);
	public rotate: number = 0;

	public project(position: Vector2D): Vector2D {
		let origin = position;//.cross(this.scale);
		let rads: number = -this.getEffectiveRotate() * Math.PI / 180;
		let x: number = origin.x * Math.cos(rads) - origin.y * Math.sin(rads);
		let y: number = origin.x * Math.sin(rads) + origin.y * Math.cos(rads);
		origin.x = x;
		origin.y = y;
		return origin;
	}

	public applyRecursive(ctx: CanvasRenderingContext2D, options?: TranslateOptions): void {
		if (this.entity.parent != null) {
			this.entity.parent.transform.applyRecursive(ctx, options);
		}
		this.apply(ctx, options);
	}

	public apply(ctx: CanvasRenderingContext2D, options?: TranslateOptions): void {
		if (options == null || options.origin && (this.origin.x != 0 || this.origin.y != 0)) {
			ctx.translate(Math.floor(this.origin.x), Math.floor(this.origin.y));
		}
		if (options == null || options.scale && (this.scale.x != 1 || this.scale.y != 1)) {
			ctx.scale(this.scale.x, this.scale.y);
		}
		if (options == null || options.rotate && this.rotate != 0)
			ctx.rotate(this.rotate * Math.PI / 180);
		//	ctx.translate(-this.origin.x, -this.origin.y);
	}

	public getEffectiveRotate(): number {
		let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		if (ancestor == null) {
			return this.rotate;
		}
		return this.rotate + ancestor.getEffectiveRotate();
	}

	public getEffectiveScale(): Vector2D {
		let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		if (ancestor == null) {
			return this.scale.clone();
		}
		return this.scale.clone().multiply(ancestor.getEffectiveScale());
	}

	public getEffectiveOrigin(): Vector2D {
		let origin = this.origin.clone();
		let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		if (ancestor != null) {
			origin.cross(ancestor.getEffectiveScale());
		}
		let rads: number = 0;
		if (ancestor != null) {
			rads = ancestor.getEffectiveRotate() * Math.PI / 180;
		}
		let x: number = origin.x * Math.cos(rads) - origin.y * Math.sin(rads);
		let y: number = origin.x * Math.sin(rads) + origin.y * Math.cos(rads);
		origin.x = x;
		origin.y = y;
		if (ancestor != null) {
			return origin.add(ancestor.getEffectiveOrigin());
		}
		return origin;
	}
}