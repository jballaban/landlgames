import { Component } from "../Core/Component";
import { EventHandler } from "../Core/EventHandler";
import { Entity } from "../Core/Entity";
import { PreRenderComponent } from "./PreRenderComponent";

export class RotateComponent extends Component {
	constructor(private velocity: number) {
		super();
	}

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.events.listen("fixedUpdate", this.fixedUpdate.bind(this));
	}

	public fixedUpdate(): void {
		this.entity.transform.rotate.z += this.velocity;
	}
}