import { Component } from "../Core/Component";
import { EventHandler } from "../Core/EventHandler";

export class RotateComponent extends Component {
	constructor(private velocity: number) {
		super();
	}

	public fixedUpdate(): void {
		this.entity.transform.rotate.z += this.velocity;
	}
}