import { Entity } from "./Entity";
import { RenderComponent } from "../Components/RenderComponent";
import { Component } from "./Component";
import { Vector3D } from "./Vector";
import { Logger } from "../Utils/Logger";
import { CameraRenderComponent } from "../Components/CameraRenderComponent";
import { EventHandler } from "./EventHandler";

export class Camera extends Entity {

	public renderer: CameraRenderComponent;

	constructor(
		public roots: Entity[],
		public width: number,
		public height: number
	) {
		super();
		this.renderer = this.registerComponent(new CameraRenderComponent()) as CameraRenderComponent;
	}

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.events.listen("render", this.renderer.render.bind(this.renderer));
	}

}