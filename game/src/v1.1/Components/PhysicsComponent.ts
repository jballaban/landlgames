import { Component } from "../Core/Component";
import { Vector2D } from "../Core/Vector";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";
import { Entity } from "../Core/Entity";
import { Shape, Rectangle } from "../Core/Shape";
import { RootEntity } from "../Core/Scene";

export interface IPhysicsOptions {
	maxX?: number;
	maxY?: number;
	force?: Vector2D;
	mass?: number;
}

export class PhysicsComponent extends Component {

	public maxX = 0;
	public maxY = 0;
	public force: Vector2D = new Vector2D();
	public mass: number = 0;

	constructor(
		public collisionShape: Shape,
		options?: IPhysicsOptions
	) {
		super();
		if (options && options.maxX != null) { this.maxX = options.maxX; }
		if (options && options.maxY != null) { this.maxY = options.maxY; }
		if (options && options.force != null) { this.force = options.force; }
		if (options && options.mass != null) { this.mass = options.mass; }
	}

	public registerCollision(): void {
		if (this.entity.top() instanceof RootEntity) {
			(this.entity.top() as RootEntity).collisions.push(this);
		} else {
			this.entity.top().events.listen("onAttach", this.registerCollision.bind(this));
		}
	}

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.events.listen("fixedUpdate", this.fixedUpdate.bind(this));
		this.registerCollision();
		//entity.events.listen("render", this.collisionArea.render.bind(this.collisionArea));
	}

	public fixedUpdate(): void {
		this.entity.transform.origin.add(this.force);
		let x1, y1, x2, y2: number;
		x1 = y1 = x2 = y2 = 0;
		/* 	if (this.collisionShape instanceof Rectangle) {
				let topleft: Vector3D = this.entity.transform.project(new Vector3D(this.collisionShape.left(), this.collisionShape.top(), 0));
				let topright: Vector3D = this.entity.transform.project(new Vector3D(this.collisionShape.right(), this.collisionShape.top(), 0));
				let bottomleft: Vector3D = this.entity.transform.project(new Vector3D(this.collisionShape.left(), this.collisionShape.bottom(), 0));
				let bottomright: Vector3D = this.entity.transform.project(new Vector3D(this.collisionShape.right(), this.collisionShape.bottom(), 0));
				x1 = Math.min(topleft.x, topright.x, bottomleft.x, bottomright.x);
				y1 = Math.min(topleft.y, topright.y, bottomleft.y, bottomright.y);
				x2 = Math.max(topleft.x, topright.x, bottomleft.x, bottomright.x);
				y2 = Math.max(topleft.y, topright.y, bottomleft.y, bottomright.y);
			} else {
				x1 = this.collisionShape.left();
				y1 = this.collisionShape.top();
				x2 = this.collisionShape.right();
				y2 = this.collisionShape.bottom();
			} */

		if (this.entity.transform.origin.x + x2 > this.maxX || this.entity.transform.origin.x + x1 < 0) {
			this.force.x *= -1;
			this.entity.transform.origin.x += this.force.x;
		}
		if (this.entity.transform.origin.y + y2 > this.maxY || this.entity.transform.origin.y + y1 < 0) {
			this.force.y *= -1;
			this.entity.transform.origin.y += this.force.y;
		}
	}
}