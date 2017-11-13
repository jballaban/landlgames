import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { IShape } from "../Shape/IShape";
import { Runtime } from "./Runtime";
import { Region, RegionContainer } from "./Region";
import { Rectangle } from "../Shape/Rectangle";
import { Array as ArrayUtil } from "../Util/Array";
import { ElementContainer } from "./ElementContainer";
import { ElementType } from "./ElementType";
import { Screen } from "../Core/Screen";
import { Circle } from "../Shape/Circle";

export abstract class Element {
	public collisions: Element[] = new Array<Element>();

	constructor(
		protected container: ElementContainer,
		public type: ElementType,
		public renderArea: IShape,
		public collisionArea: IShape,
		public zIndex: number,
		public collisionFilter: ElementType
	) { }

	public ready(): boolean {
		return true;
	}

	public onCollide(element: Element, on: boolean): void {
		// to implement
	}

	public inc(offsetx: number, offsety: number): void {
		this.move(this.renderArea.origin.offsetX + offsetx, this.renderArea.origin.offsetY + offsety);
	}

	public move(offsetX: number, offsetY: number): void {
		if (offsetX === this.renderArea.origin.offsetX && offsetY === this.renderArea.origin.offsetY) { return; }
		this.renderArea.origin.move(offsetX, offsetY);
	}

	public update(step: number): void {
		// to override
	}

	// todo this feels like the element should call when they change.. that's what we do with colors
	public postUpdate(): void {
		if (this.renderArea.changed()) {
			this.container.change(this, true);
		}
	}

	public postRender(): void {
		this.renderArea.clearChanged();
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;
}