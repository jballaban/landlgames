import { Entity } from "./Entity";
import { RenderComponent } from "../Components/RenderComponent";
import { EventHandler } from "../../v0/Core/EventHandler";
import { Component } from "./Component";
import { IEventManager } from "./IEventManager";
import { Vector3D } from "./Vector";
import { Logger } from "../Utils/Logger";
import { CameraRenderComponent } from "../Components/CameraRenderComponent";

export class Camera extends Entity implements IEventManager {

	private renders: RenderComponent[] = new Array<RenderComponent>();
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

	public getEffectiveWidth(rootScale: Vector3D): number {
		return rootScale == null ? this.width : this.width * rootScale.x;
	}

	public getEffectiveHeight(rootScale: Vector3D): number {
		return rootScale == null ? this.height : this.height * rootScale.y;
	}

	public registerEntity(entity: Entity): Entity {
		super.registerEntity(entity);
		entity.registerRecursiveEvents(this);
		return entity;
	}

	public registerEvents(component: Component) {
		const eventList = ["render"];
		for (let i: number = 0; i < eventList.length; i++) {
			if (component[eventList[i]]) {
				this.events.listen(eventList[i], component[eventList[i]].bind(component));
			}
		}
	}
}