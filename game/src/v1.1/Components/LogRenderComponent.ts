import { RenderComponent } from "./RenderComponent";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";

export class LogRenderComponent extends RenderComponent {

	public constructor(private lookup: Function) {
		super();
		lookup.bind(this);
	}

	public registerEvents(events: EventHandler): void {
		events.listen("render", this.render.bind(this));
	}

	public render(ctx: CanvasRenderingContext2D): void {
		Logger.log(this.lookup());
	}
}