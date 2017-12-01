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

	public render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		if (ancestor != null)
			ancestor.applyRecursive(ctx);
		ctx.beginPath();
		ctx.rect(
			this.entity.transform.origin.x - this.camera.width / 2,
			this.entity.transform.origin.y - this.camera.height / 2,
			this.camera.width,
			this.camera.height);
		ctx.clip();

		ctx.save();
		this.entity.transform.apply(ctx);

		let scale = ancestor == null ? new Vector3D(1, 1, 1) : ancestor.getEffectiveScale();
		//	scale = this.entity.transform.scale;
		ctx.translate(-this.camera.width / 2, -this.camera.height / 2);
		//	ctx.translate((-this.camera.width * scale.x) / 2, (-this.camera.height * scale.y) / 2);
		//this.entity.transform.applyRecursive(ctx);
		//this.entity.transform.apply(ctx);
		//	let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		//	let scale = ancestor == null ? new Vector3D(1, 1, 1) : ancestor.scale;
		//ctx.translate(-this.camera.width / 2, -this.camera.height / 2);
		this.camera.events.fire("render", ctx, null, null, null);
		ctx.restore();

		this.camera.events.fire("renderChild", ctx, null, null, null);
		ctx.strokeStyle = "rgb(213,38,181)";
		ctx.lineWidth = 3;
		ctx.strokeRect(
			this.entity.transform.origin.x - this.camera.width / 2,
			this.entity.transform.origin.y - this.camera.height / 2,
			this.camera.width - 1,
			this.camera.height - 1);
		ctx.restore();
		/* 
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
	
		ctx.translate(origin.x, origin.y);
		ctx.rotate(rotate.z * Math.PI / 180);
		//ctx.scale(scale.x, scale.y);
		ctx.translate(-width / 2 - offset.x, -height / 2 - offset.y);
		this.camera.events.fire("render", ctx, origin, scale, null);
		ctx.restore(); */
	}
}