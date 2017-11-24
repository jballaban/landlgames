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

	constructor(public childArea: IShape, private shadowLen: number) {
		this.resize();
		this.type = childArea.type | ShapeType.Shadow;
		this.origin = childArea.origin;
	}

	public resize(): void {
		if (this.childArea.type & ShapeType.Circle) {
			this.area = new Circle(this.childArea.origin, (this.childArea as Circle).r + this.shadowLen);
		} else if (this.childArea.type & ShapeType.Rectangle) {
			this.area = new Rectangle(
				new Point(-this.shadowLen, -this.shadowLen, (this.childArea as Rectangle).topLeft),
				new Point(this.shadowLen, this.shadowLen, (this.childArea as Rectangle).bottomRight)
			);
		}
	}

	public y2(): number {
		return this.area.y2();
	}

	public intersects(shape: IShape): boolean {
		return this.area.intersects(shape);
	}

	public render(ctx: CanvasRenderingContext2D, color: string): void {
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