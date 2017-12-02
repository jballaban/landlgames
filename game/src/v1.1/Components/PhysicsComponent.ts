import { Component } from "../Core/Component";
import { Vector3D } from "../Core/Vector";
import { Logger } from "../Utils/Logger";

export class PhysicsComponent extends Component {
	constructor(private force: Vector3D, private min: Vector3D, private max: Vector3D) {
		super();
		Logger.log(this.force);
	}

	public fixedUpdate(): void {

		this.entity.transform.origin.add(this.force);
		if (this.entity.transform.origin.x > this.max.x || this.entity.transform.origin.x < this.min.x) {
			this.force.x *= -1;
			this.entity.transform.origin.x += this.force.x;
		}
		if (this.entity.transform.origin.y > this.max.y || this.entity.transform.origin.y < this.min.y) {
			this.force.y *= -1;
			this.entity.transform.origin.y += this.force.y;
		}
	}
}