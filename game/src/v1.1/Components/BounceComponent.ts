import { Component } from "../Core/Component";
import { Entity } from "../Core/Entity";
import { Vector3D } from "../Core/Vector";
import { Logger } from "../Utils/Logger";

export class BounceComponent extends Component {
	private start: Vector3D;
	private velocity: Vector3D;
	constructor(velocity: number, private end: Vector3D) {
		super();
		this.velocity = new Vector3D(velocity, velocity, 0);
	}
	public onAttach(entity: Entity) {
		super.onAttach(entity);
		this.start = entity.transform.scale.clone();
		if (this.start.magnitude() > this.end.magnitude()) {
			let temp: Vector3D = this.start;
			this.start = this.end;
			this.end = temp;
		}
	}
	public fixedUpdate(): void {
		let scale: Vector3D = this.entity.transform.scale;
		scale.add(this.velocity);
		if (scale.x > this.end.x || scale.y > this.end.y || scale.x < this.start.x || scale.y < this.start.y) {
			this.velocity.multiply(-1);
			scale.add(this.velocity);
		}
	}
}