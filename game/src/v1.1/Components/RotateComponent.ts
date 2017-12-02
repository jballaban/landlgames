import { Component } from "../Core/Component";
import { EventHandler } from "../Core/EventHandler";

export class RotateComponent extends Component {
	constructor(private velocity: number) {
		super();
	}

	public registerEvents(events: EventHandler): void {
		events.listen("fixedUpdate", this.fixedUpdate.bind(this));
	}

	fixedUpdate(): void {
		this.entity.transform.rotate.z += this.velocity;
	}
}