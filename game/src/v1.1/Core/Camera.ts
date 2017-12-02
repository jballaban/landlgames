import { Entity } from "./Entity";
import { RenderComponent } from "../Components/RenderComponent";
import { Component } from "./Component";
import { Vector3D } from "./Vector";
import { Logger } from "../Utils/Logger";
import { CameraRenderComponent } from "../Components/CameraRenderComponent";
import { EventHandler } from "./EventHandler";

export class Camera extends Entity {

	public childEvents: EventHandler = new EventHandler();

	constructor(
		roots: Entity[],
		public width: number,
		public height: number
	) {
		super();
		this.registerComponent(new CameraRenderComponent());
		for (let i: number = 0; i < roots.length; i++) {
			roots[i].registerRecursiveEvents(this.events);
		}
	}

	public get renderer(): CameraRenderComponent { return this.getComponent<CameraRenderComponent>(CameraRenderComponent); }

	public registerEntity<T extends Entity>(entity: T): T {
		super.registerEntity(entity);
		entity.registerRecursiveEvents(this.childEvents);
		return entity;
	}

}