import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";

export class RectRenderComponent extends RenderComponent {

	public constructor(public width: number, public height: number, public color: string) {
		super();
	}

	public render(ctx: CanvasRenderingContext2D, cameraOrigin: Vector3D, cameraScale: Vector3D): void {
		let origin = this.entity.transform.getEffectiveOrigin(cameraOrigin, cameraScale);
		//Logger.log("rect:" + origin + " camera:" + cameraOrigin);
		let scale = this.entity.transform.getEffectiveScale(cameraScale);
		ctx.fillStyle = this.color;
		ctx.fillRect(origin.x, origin.y, this.width * scale.x, this.height * scale.y);
	}
}