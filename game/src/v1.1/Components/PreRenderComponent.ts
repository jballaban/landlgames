import { Component } from "../Core/Component";
import { Entity } from "../Core/Entity";
import { Logger } from "../Utils/Logger";

export abstract class PreRenderComponent extends Component {
	/* 	public abstract applyRecursive(ctx: CanvasRenderingContext2D); */
	public abstract apply(ctx: CanvasRenderingContext2D);
	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.events.listen("preRender", this.apply.bind(this));
	}
}