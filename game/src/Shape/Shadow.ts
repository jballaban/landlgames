// tslint:disable:no-bitwise
import { IShape, ShapeType } from "./IShape";
import { Point } from "./Point";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Logger } from "../Util/Logger";

export class Shadow implements IShape {

	private area: IShape;
	public type: ShapeType;
	public origin: Point;

	constructor(private childArea: IShape, private shadowLen: number) {
		if (childArea.type & ShapeType.Circle) {
			this.area = new Circle(childArea.origin, (childArea as Circle).r + shadowLen);
		} else if (childArea.type & ShapeType.Rectangle) {
			this.area = new Rectangle(
				new Point(-shadowLen / 2, -shadowLen / 2, (childArea as Rectangle).topLeft),
				new Point(shadowLen / 2, shadowLen / 2, (childArea as Rectangle).bottomRight)
			);
		}
		this.type = childArea.type | ShapeType.Shadow;
		this.origin = this.area.origin;
	}

	public intersects(shape: IShape): boolean {
		return this.area.intersects(shape);
	}

	public render(ctx: CanvasRenderingContext2D, color: string): void {
		Logger.log((this.area as Circle).toString());
		ctx.save();
		ctx.shadowBlur = this.shadowLen;
		ctx.shadowColor = "rgb(0,0,0)";
		this.childArea.render(ctx, color);
		ctx.restore();
	}

	public changed(): boolean {
		return this.area.changed();
	}

	public clearChanged(): void {
		this.area.clearChanged();
	}


}