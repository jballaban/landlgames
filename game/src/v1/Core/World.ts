import { Entity, IPostUpdate, IUpdate, IPreUpdate, IFrameStart } from "./Entity";
import { Model } from "./Model";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";
import { Component } from "./Component";
import { Game } from "./Game";
import { Scene } from "./Scene";

export class World extends Entity {

	public constructor(
		public width: number,
		public height: number,
		private scene: Scene
	) {
		super();
	}

	public registerEntity(entity: Entity): void {
		super.registerEntity(entity as Entity);
		this.scene.registerEvents(entity);
	}

	public registerComponent(component: Component): void {
		super.registerComponent(component);
		this.scene.registerEvents(component);
	}

}