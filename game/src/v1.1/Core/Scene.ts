import { Entity } from "./Entity";
import { Component } from "./Component";
import { Canvas } from "./Canvas";
import { Camera } from "./Camera";
import { EventHandler } from "./EventHandler";

export class Scene {
	private entities: Entity[] = new Array<Entity>();
	private cameras: Camera[] = new Array<Camera>();
	private events: EventHandler = new EventHandler();
	private canvas: Canvas;
	public constructor() {
		this.canvas = new Canvas(0, 0, window.innerWidth, window.innerHeight);
	}

	public fixedUpdate(): void {
		this.events.fire("fixedUpdate");
	}

	public update(): void {
		this.events.fire("update");
	}

	public lateUpdate(): void {
		this.events.fire("lateUpdate");
	}

	public render(): void {
		this.canvas.ctx.clearRect(this.canvas.x, this.canvas.y, this.canvas.width, this.canvas.height);
		for (let i = 0; i < this.cameras.length; i++) {
			this.cameras[i].renderer.render(this.canvas.ctx);
		}
	}

	public destroy(): void {
		this.canvas.destroy();
		// todo
	}

	public registerEntity<T extends Entity>(entity: T): T {
		this.entities.push(entity);
		entity.onAttach(this);
		if (entity instanceof Camera) {
			this.cameras.push(entity);
		}
		entity.registerRecursiveEvents(this.events);
		return entity;
	}

}