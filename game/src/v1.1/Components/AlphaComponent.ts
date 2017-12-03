import { Component } from "../Core/Component";
import { EventHandler } from "../Core/EventHandler";
import { Logger } from "../Utils/Logger";
import { PreRenderComponent } from "./PreRenderComponent";

export class AlphaComponent extends PreRenderComponent {
	constructor(public alpha: number) {
		super();
	}

	public registerEvents(events: EventHandler): void {
		// none
	}
	/* public applyRecursive(ctx: CanvasRenderingContext2D): void {
		let ancestor = this.entity.getAncestorComponent<AlphaComponent>(AlphaComponent);
		if (ancestor != null) {
			ancestor.applyRecursive(ctx);
		}
		this.apply(ctx);
	} */

	public apply(ctx: CanvasRenderingContext2D) {
		ctx.globalAlpha *= this.alpha;
	}

}