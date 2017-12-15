import { Component } from "../Core/Component";
import { Entity } from "../Core/Entity";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";

export class PreRenderComponent extends Component {

	public registerEvents(events: EventHandler): void {
		events.listen("preRender", this.apply.bind(this));
	}

	public alpha: number = 1;

	/* 	public abstract applyRecursive(ctx: CanvasRenderingContext2D); */
	public apply(ctx: CanvasRenderingContext2D) {
		ctx.globalAlpha *= this.alpha;
	}

}