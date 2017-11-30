import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Camera } from "../Core/Camera";
import { Entity } from "../Core/Entity";

export class CameraRenderComponent extends RenderComponent {

	public offset: Vector3D = new Vector3D(0, 0, 0);

	public getEffectiveOffset(rootScale: Vector3D): Vector3D {
		return this.offset.clone().cross(rootScale);
	}

	public onAttach(entity: Entity) {
		if (entity instanceof Camera) {
			super.onAttach(entity);
		} else
			throw "Cannot attach CameraRenderComponent to non Camera entity";
	}

	private get camera(): Camera { return this.entity as Camera; }

	public render(ctx: CanvasRenderingContext2D, cameraOrigin?: Vector3D, cameraScale?: Vector3D, cameraRotate?: Vector3D) {
		let scale = this.entity.transform.getEffectiveScale(cameraScale);
		let width = this.camera.getEffectiveWidth(cameraScale);
		Logger.log("camera width " + width);
		let height = this.camera.getEffectiveHeight(cameraScale);
		let rotate = this.camera.transform.getEffectiveRotate(cameraRotate);
		let origin = this.entity.transform.getEffectiveOrigin(cameraOrigin, cameraScale, cameraRotate)
		//	.subtract(new Vector3D(width / 2, height / 2, 0))
		let offset: Vector3D = this.getEffectiveOffset(scale);
		//Logger.log(offset + " scale" + scale);
		ctx.save();
		//ctx.beginPath();
		//	ctx.rect(origin.x - width / 2, origin.y - height / 2, width, height);
		//	ctx.clip();
		ctx.translate(origin.x, origin.y);
		ctx.rotate(rotate.z * Math.PI / 180);
		//ctx.scale(scale.x, scale.y);
		ctx.translate(-width / 2 - offset.x, -height / 2 - offset.y);
		this.camera.events.fire("render", ctx, origin, scale, null);
		ctx.restore();
	}
}