import { Component } from "../Core/Component";

export class RotateComponent extends Component {
	fixedUpdate(): void {
		this.entity.transform.rotate.z += .5;
	}
}