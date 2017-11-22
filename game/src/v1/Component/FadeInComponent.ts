import { Component } from "../Core/Component";
import { Entity, Composer } from "../Core/Entity";
import { Logger } from "../Util/Logger";

export class FadeInComponent extends Component {

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.attributes.set("alpha", 0);
	}

	public update(seconds: number): void {
		let alpha: number = this.entity.attributes.get("alpha");
		if (alpha < 1) {
			this.entity.attributes.set("alpha", Math.min(1, alpha + 0.01));
		}
	}

}