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
import { SpritePool } from "./SpritePool";
import { Logger } from "../Util/Logger";

export abstract class Element {
	public collisions: Element[] = new Array<Element>();

	constructor(
		protected container: ElementContainer,
		protected spritePool: SpritePool,
		public type: ElementType,
		public renderArea: IShape,
		public collisionArea: IShape,
		public zIndex: number,
		public collisionFilter: ElementType
	) { }

	public onCollide(element: Element, on: boolean): void {
		// to implement
	}

	public inc(offsetx: number, offsety: number): void {
		this.move("render", this.renderArea.origin.offsetX + offsetx, this.renderArea.origin.offsetY + offsety);
		this.move("collision", this.collisionArea.origin.offsetX + offsetx, this.collisionArea.origin.offsetY + offsety);
	}

	public move(type: string, offsetX: number, offsetY: number): void {
		// Logger.log(this.container.area.x() + "," + offsetX);
		offsetX = Math.min(this.container.area.x2(), Math.max(offsetX, 0));
		offsetY = Math.min(this.container.area.y2(), Math.max(offsetY, 0));
		var area: IShape;
		switch (type) {
			case "render":
				area = this.renderArea;
				break;
			case "collision":
				area = this.collisionArea;
				break;
			default:
				throw "Unknown type " + type;
		}
		if (area == null) {
			return;
		}
		if (offsetX === area.origin.offsetX && offsetY === area.origin.offsetY) { return; }
		area.origin.move(offsetX, offsetY);
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