import { Entity } from "./Entity";
import { RenderComponent } from "../Components/RenderComponent";
import { Component } from "./Component";
import { Vector3D } from "./Vector";
import { Logger } from "../Utils/Logger";
import { CameraRenderComponent } from "../Components/CameraRenderComponent";
import { EventHandler } from "./EventHandler";

export class Camera extends Entity {

	public childEvents: EventHandler = new EventHandler();
	public renderer: CameraRenderComponent;

	constructor(
		roots: Entity[],
		public width: number,
		public height: number
	) {
		super();
		this.renderer = this.registerComponent(new CameraRenderComponent()) as CameraRenderComponent;
		for (let i: number = 0; i < roots.length; i++) {
			roots[i].registerRecursiveEvents(this.events);
		}
	}

	public registerEntity<T extends Entity>(entity: T): T {
		super.registerEntity(entity);
		entity.registerRecursiveEvents(this.childEvents);
		return entity;
	}

}