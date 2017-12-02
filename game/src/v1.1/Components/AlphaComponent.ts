import { Component } from "../Core/Component";
import { EventHandler } from "../Core/EventHandler";

export class AlphaComponent extends Component {
	constructor(private alpha: number) {
		super();
	}

	public registerEvents(events: EventHandler): void {
		events.listen("preRender", this.preRender.bind(this));
	}

	public preRender(ctx: CanvasRenderingContext2D): void {
		ctx.globalAlpha = this.alpha;
	}
}