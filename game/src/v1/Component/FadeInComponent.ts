import { Component } from "../Core/Component";
import { Entity, Composer } from "../Core/Entity";
import { Logger } from "../Util/Logger";
import { Model } from "../Core/Model";

export class FadeInComponent extends Component {

	public onAttach(entity: Model): void {
		super.onAttach(entity);
		entity.alpha = 0;
	}

	public update(): void {
		(this.entity as Model).alpha += .01;
	}

}