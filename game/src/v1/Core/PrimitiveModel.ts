import { IShape } from "../Foundation/IShape";
import { Color } from "../Foundation/Color";
import { Model } from "./Model";
import { Logger } from "../Util/Logger";

export class PrimitiveModel extends Model {
	constructor(
		public shape: IShape,
		public color: Color
	) {
		super();
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.globalAlpha = this.calc("alpha");
		this.shape.draw(ctx, this.color.toString(), this.calc("origin").x, this.calc("origin").y);
		ctx.restore();
	}

}