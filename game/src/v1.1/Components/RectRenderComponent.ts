import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Texture } from "../Textures/Texture";

export class RectRenderComponent extends RenderComponent {

	public constructor(public width: number, public height: number, public texture: Texture) {
		super();
	}

	public render(ctx: CanvasRenderingContext2D, cameraOrigin: Vector3D, cameraScale: Vector3D, cameraRotate: Vector3D): void {
		let origin = this.entity.transform.getEffectiveOrigin(cameraOrigin, cameraScale, cameraRotate);
		let scale = this.entity.transform.getEffectiveScale(cameraScale);
		let rotate = this.entity.transform.getEffectiveRotate(cameraRotate);
		ctx.save();
		ctx.translate(origin.x, origin.y);
		ctx.rotate(rotate.z * Math.PI / 180);
		//	ctx.translate(-this.width * scale.x / 2, -this.height * scale.y / 2);
		this.texture.apply(ctx, 0, 0, this.width * scale.x, this.height * scale.y);
		ctx.restore();
	}
}