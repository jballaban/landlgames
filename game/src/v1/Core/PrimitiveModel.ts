import { IShape } from "../Foundation/IShape";
import { Color } from "../Foundation/Color";
import { Model } from "./Model";
import { Logger } from "../Util/Logger";
import { RenderComponent } from "./Component";

export class PrimitiveModel extends Model {
	constructor(
		public shape: IShape,
		public color: Color
	) {
		super();
		this.registerComponent(new RenderComponent(this.shape));
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.shape.draw(ctx, this.color.toString());
	}

}