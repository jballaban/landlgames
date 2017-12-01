import { Entity } from "./Entity";
import { RenderComponent } from "../Components/RenderComponent";
import { EventHandler } from "../../v0/Core/EventHandler";
import { Component } from "./Component";
import { IEventManager } from "./IEventManager";
import { Vector3D } from "./Vector";
import { Logger } from "../Utils/Logger";
import { CameraRenderComponent } from "../Components/CameraRenderComponent";

export class Camera extends Entity implements IEventManager {

	constructor(
		roots: Entity[],
		public width: number,
		public height: number
	) {
		super();
		this.registerComponent(new CameraRenderComponent());
		for (let i: number = 0; i < roots.length; i++) {
			roots[i].registerRecursiveEvents(this);
		}
	}

	public get renderer(): CameraRenderComponent { return this.getComponent<CameraRenderComponent>(CameraRenderComponent); }

	public registerEntity<T extends Entity>(entity: T): T {
		super.registerEntity(entity);
		entity.registerRecursiveEvents(this);
		return entity;
	}

	public registerEvents(component: Component) {
		const eventList = ["render"];
		let isChild = component.entity.getAncestor<this>(this.constructor);
		for (let i: number = 0; i < eventList.length; i++) {
			if (component[eventList[i]]) {
				if (!isChild) {
					this.events.listen(eventList[i], component[eventList[i]].bind(component));
				} else {
					this.events.listen(eventList[i] + "Child", component[eventList[i]].bind(component));
				}
			}
		}
	}
}