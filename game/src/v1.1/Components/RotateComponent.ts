import { Component } from "../Core/Component";

export class RotateComponent extends Component {
	constructor(private velocity: number) {
		super();
	}
	fixedUpdate(): void {
		this.entity.transform.rotate.z += this.velocity;
	}
}