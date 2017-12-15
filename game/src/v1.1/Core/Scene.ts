import { Entity } from "./Entity";
import { Component } from "./Component";
import { Canvas } from "./Canvas";
import { Camera } from "./Camera";
import { EventHandler } from "./EventHandler";
import { Logger } from "../Utils/Logger";

export class Scene {
	public root: Entity = new Entity();
	private cameras: Camera[] = new Array<Camera>();
	private canvas: Canvas;
	public constructor() {
		this.canvas = new Canvas(0, 0, window.innerWidth, window.innerHeight);
	}

	public onStart(): void {
		this.cameras = this.root.getChildren<Camera>(Camera);
	}

	public fixedUpdate(): void {
		this.root.events.fire("fixedUpdate");
	}

	public update(): void {
		this.root.events.fire("update");
	}

	public lateUpdate(): void {
		this.root.events.fire("lateUpdate");
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

}