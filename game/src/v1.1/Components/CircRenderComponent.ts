import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Texture } from "../Textures/Texture";
import { EventHandler } from "../Core/EventHandler";

export class CircRenderComponent extends RenderComponent {

	public constructor(public radius: number, public texture: Texture) {
		super();
	}

	public registerEvents(events: EventHandler): void {
		events.listen("render", this.render.bind(this));
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		this.entity.transform.applyRecursive(ctx);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		ctx.clip();
		this.texture.apply(ctx, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
		ctx.restore();
		//Logger.log(this.entity.transform.origin);
		/* 	let origin = this.entity.transform.getEffectiveOrigin(cameraOrigin, cameraScale, cameraRotate);
			let scale = this.entity.transform.getEffectiveScale(cameraScale);
			let rotate = this.entity.transform.getEffectiveRotate(cameraRotate);
			ctx.save();
			ctx.translate(origin.x, origin.y);
			ctx.rotate(rotate.z * Math.PI / 180);
			//	ctx.translate(-this.width * scale.x / 2, -this.height * scale.y / 2);
			this.texture.apply(ctx, 0, 0, this.width * scale.x, this.height * scale.y);
			ctx.restore(); */
	}
}