import { RenderComponent } from "./RenderComponent";
import { Logger } from "../Utils/Logger";

export class LogRenderComponent extends RenderComponent {

	public constructor(private msg: string) {
		super();
	}

	public render(ctx: CanvasRenderingContext2D): void {
		Logger.log(this.msg);
	}
}