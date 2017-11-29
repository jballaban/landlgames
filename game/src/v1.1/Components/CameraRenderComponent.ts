import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Camera } from "../Core/Camera";
import { Entity } from "../Core/Entity";

export class CameraRenderComponent extends RenderComponent {

	public onAttach(entity: Entity) {
		if (entity instanceof Camera) {
			super.onAttach(entity);
		} else
			throw "Cannot attach CameraRenderComponent to non Camera entity";
	}

	private get camera(): Camera { return this.entity as Camera; }

	public render(ctx: CanvasRenderingContext2D, cameraOrigin?: Vector3D, cameraScale?: Vector3D) {
		let scale = this.entity.transform.getEffectiveScale(cameraScale);
		let width = this.camera.getEffectiveWidth(cameraScale);
		let height = this.camera.getEffectiveHeight(cameraScale);
		let origin = this.entity.transform.getEffectiveOrigin(cameraOrigin, cameraScale)
			.subtract(new Vector3D(width / 2, height / 2, 0))
		// Clip a rectangular area
		ctx.save();
		ctx.beginPath();
		ctx.rect(origin.x, origin.y, width, height);
		ctx.clip();
		this.camera.events.fire("render", ctx, origin, scale);
		ctx.restore();
	}
}