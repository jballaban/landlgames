import { Entity, IPostUpdate, IUpdate } from "./Entity";
import { Model } from "./Model";
import { Level } from "./Level";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";

export class World extends Entity {
	private models: Model[] = new Array<Model>();
	private postUpdates: IPostUpdate[] = new Array<IPostUpdate>();
	private updates: IUpdate[] = new Array<IUpdate>();

	public constructor(
		public width: number,
		public height: number
	) {
		super();
	}

	public update(): void {
		for (let i: number = 0; i < this.updates.length; i++) {
			this.updates[i].update();
		}
	}

	public getVisible(viewport: Viewport): Model[] {
		return this.models;
	}

	public registerEntity(entity: Entity): void {
		super.registerEntity(entity as Entity);
		this.registerCache(entity);

	}

	public registerComponent(component: Component): void {
		super.registerComponent(component);
		this.registerCache(component);
	}

	private registerCache(obj: any): void {
		if (obj instanceof Model) {
			this.models.push(obj);
		}
		// tslint:disable-next-line:no-string-literal
		if (obj["update"]) {
			this.updates.push(obj);
		}
		// tslint:disable-next-line:no-string-literal
		if (obj["postUpdate"]) {
			this.postUpdates.push(obj);
		}
		if (obj instanceof Entity) {
			for (let i: number = 0; i < obj.entities.length; i++) {
				this.registerCache(obj.entities[i]);
			}
			for (let i: number = 0; i < obj.components.length; i++) {
				this.registerCache(obj.components[i]);
			}
		}

	}

}