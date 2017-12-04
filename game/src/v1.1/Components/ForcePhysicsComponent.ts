import { Component } from "../Core/Component";
import { Entity } from "../Core/Entity";
import { Vector3D } from "../Core/Vector";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";

export class ForcePhysicsComponent extends Component {
	public velocity: Vector3D;
	public active: boolean = false;

	constructor(
		velocity: number,
		private resistance: number,
		private minVelocityMagnitude: number,
		private minValue: Vector3D,
		private refVector: Vector3D
	) {
		super();
		this.velocity = new Vector3D(velocity, velocity, 0);
	}

	public registerEvents(events: EventHandler): void {
		events.listen("fixedUpdate", this.fixedUpdate.bind(this));
	}

	public onAttach(entity: Entity) {
		super.onAttach(entity);
		this.active = true;
	}

	public fixedUpdate(): void {
		if (!this.active) { return; }
		this.refVector.add(this.velocity);
		this.refVector.x = Math.max(this.refVector.x, this.minValue.x);
		this.refVector.y = Math.max(this.refVector.y, this.minValue.y);
		this.velocity.multiply(1 - this.resistance);
		this.active = this.velocity.magnitude() >= this.minVelocityMagnitude;
	}
}