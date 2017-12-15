import { Component } from "../Core/Component";
import { Vector3D } from "../Core/Vector";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";
import { Entity } from "../Core/Entity";
import { Shape } from "../Core/Shape";

export interface IPhysicsOptions {
	maxX?: number;
	maxY?: number;
	force?: Vector3D;
	mass?: number;
}

export class PhysicsComponent extends Component {

	public maxX = 0;
	public maxY = 0;
	public force: Vector3D = Vector3D.Zero.clone();
	public mass: number = 0;
	public collisionArea: Shape;

	constructor(collisionArea: Shape, options?: IPhysicsOptions) {
		super();
		this.collisionArea = collisionArea;
		if (options && options.maxX != null) { this.maxX = options.maxX; }
		if (options && options.maxY != null) { this.maxY = options.maxY; }
		if (options && options.force != null) { this.force = options.force; }
		if (options && options.mass != null) { this.mass = options.mass; }
	}

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.events.listen("fixedUpdate", this.fixedUpdate.bind(this));
	}

	public fixedUpdate(): void {
		this.entity.transform.origin.add(this.force);
		if (this.entity.transform.origin.x > this.maxX || this.entity.transform.origin.x < 0) {
			this.force.x *= -1;
			this.entity.transform.origin.x += this.force.x;
		}
		if (this.entity.transform.origin.y > this.maxY || this.entity.transform.origin.y < 0) {
			this.force.y *= -1;
			this.entity.transform.origin.y += this.force.y;
		}
	}
}