import { Component } from "../Core/Component";
import { Vector3D } from "../Core/Vector";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";
import { PreRenderComponent } from "./PreRenderComponent";

export class TransformComponent extends Component {
	public origin: Vector3D = new Vector3D(0, 0, 0);
	public scale: Vector3D = new Vector3D(1, 1, 1);
	public rotate: Vector3D = new Vector3D(0, 0, 0);

	public registerEvents(events: EventHandler): void {
		// no events
	}

	public applyRecursive(ctx: CanvasRenderingContext2D): void {
		if (this.entity.parent != null) {
			this.entity.parent.transform.applyRecursive(ctx);
		}
		this.apply(ctx);
	}

	public apply(ctx: CanvasRenderingContext2D): void {
		if (this.origin.x != 0 || this.origin.y != 0)
			ctx.translate(Math.floor(this.origin.x), Math.floor(this.origin.y));
		if (this.scale.x != 1 || this.scale.y != 1)
			ctx.scale(this.scale.x, this.scale.y);
		if (this.rotate.z != 0)
			ctx.rotate(this.rotate.z * Math.PI / 180);
		//	ctx.translate(-this.origin.x, -this.origin.y);
	}
	/* 
		public getEffectiveRotate(): Vector3D {
			let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
			if (ancestor == null) {
				return this.rotate.clone();
			}
			return this.rotate.clone().add(ancestor.getEffectiveRotate());
		}
	
		public getEffectiveScale(): Vector3D {
			let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
			if (ancestor == null) {
				return this.scale.clone();
			}
			return this.scale.clone().cross(ancestor.getEffectiveScale());
		}
	
		public getEffectiveOrigin(): Vector3D {
			let origin = this.origin.clone();
			let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
			if (ancestor != null) {
				origin.cross(ancestor.getEffectiveScale());
			}
			let rads: number = 0;
			if (ancestor != null) {
				rads = ancestor.getEffectiveRotate().z * Math.PI / 180;
			}
			let x: number = origin.x * Math.cos(rads) - origin.y * Math.sin(rads);
			let y: number = origin.x * Math.sin(rads) + origin.y * Math.cos(rads);
			origin.x = x;
			origin.y = y;
			if (ancestor != null) {
				return origin.add(ancestor.getEffectiveOrigin());
			}
			return origin;
		} */
}