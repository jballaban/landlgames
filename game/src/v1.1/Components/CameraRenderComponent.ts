import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Camera } from "../Core/Camera";
import { Entity } from "../Core/Entity";
import { EventHandler } from "../Core/EventHandler";

export class CameraRenderComponent extends RenderComponent {

	public offset: Vector3D = new Vector3D(0, 0, 0);

	private camera: Camera;

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		this.camera = entity as Camera;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		if (this.entity.parent != null) {
			this.entity.parent.transform.apply(ctx);
		}
		ctx.beginPath();
		ctx.rect(
			Math.floor(this.entity.transform.origin.x - (this.camera.width / 2)),
			Math.floor(this.entity.transform.origin.y - (this.camera.height / 2)),
			Math.floor(this.camera.width),
			Math.floor(this.camera.height));
		ctx.clip();

		ctx.save();
		this.entity.transform.apply(ctx);
		ctx.translate(-Math.floor(this.camera.width / 2), -Math.floor(this.camera.height / 2));
		ctx.translate(-Math.floor(this.offset.x), -Math.floor(this.offset.y));
		for (let i: number = 0; i < this.camera.roots.length; i++) {
			if (this.camera.roots[i] instanceof Camera) {
				(this.camera.roots[i] as Camera).renderer.render(ctx);
			} else {
				this.camera.roots[i].events.fire("render", ctx);
			}
		}
		ctx.restore();

		this.camera.events.fire("render", ctx);

		/* ctx.strokeStyle = "rgb(213,38,181)";
		ctx.lineWidth = 3;
		ctx.strokeRect(
			Math.floor(this.entity.transform.origin.x - (this.camera.width / 2)),
			Math.floor(this.entity.transform.origin.y - (this.camera.height / 2)),
			Math.floor(this.camera.width - 1),
			Math.floor(this.camera.height - 1)); */
		ctx.restore();
	}
}