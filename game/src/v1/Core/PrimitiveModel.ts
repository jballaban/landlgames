import { IShape } from "../Foundation/IShape";
import { Color } from "../Foundation/Color";
import { Model, RenderOptions } from "./Model";
import { Logger } from "../Util/Logger";
import { Composer } from "./Entity";
import { Vector2D } from "./Vector";

export class PrimitiveModel extends Model {
	constructor(
		public shape: IShape,
		public color: Color
	) {
		super();
	}

	public render(ctx: CanvasRenderingContext2D, options: RenderOptions): void {
		ctx.globalAlpha = options.alpha;
		this.shape.draw(ctx, this.color.toString(), options.position.x, options.position.y);
	}

}