import { Entity } from "./Entity";
import { Component } from "./Component";
import { Canvas } from "./Canvas";
import { Camera } from "./Camera";
import { EventHandler } from "./EventHandler";
import { Logger } from "../Utils/Logger";
import { PhysicsComponent } from "../Components/PhysicsComponent";
import { Physics } from "../../v0/Core/Physics";
import { Collision } from "../../v0/Util/Collision";

export class RootEntity extends Entity {
	public collisions: PhysicsComponent[] = new Array<PhysicsComponent>();
}

export class Scene {
	public root: RootEntity = new RootEntity();
	private cameras: Camera[] = new Array<Camera>();

	protected canvas: Canvas;
	public constructor() {
		this.canvas = new Canvas(0, 0, window.innerWidth, window.innerHeight);
	}

	public onStart(): void {
		this.cameras = this.root.getChildren<Camera>(Camera);
	}

	public fixedUpdate(): void {
		this.root.events.fire("fixedUpdate");
		this.checkCollisions();
	}

	public update(): void {
		this.root.events.fire("update");
	}

	public lateUpdate(): void {
		this.root.events.fire("lateUpdate");
	}

	public render(): void {
		this.canvas.ctx.clearRect(this.canvas.x, this.canvas.y, this.canvas.width, this.canvas.height);
		for (let i: number = 0; i < this.cameras.length; i++) {
			this.cameras[i].renderer.render(this.canvas.ctx);
		}
	}

	public checkCollisions(): void {
		// todo
	}

	public destroy(): void {
		this.canvas.destroy();
		// todo
	}

}