// tslint:disable:no-bitwise
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
import { Vector } from "./Vector";


export enum ElementFlag {
	None = 0,
	Renderable = 1
}

export interface IComponent {
	name: string;
	flags: ElementFlag;
}

export interface IRenderable {
	area: IShape;
	render(ctx: CanvasRenderingContext2D): void;
}

export interface IUpdatable {
	update(dt: number): void;
}

export class RenderComponent implements IComponent {
	public name = "Render";
	public flags: ElementFlag = ElementFlag.Renderable;
	constructor(private obj: IRenderable) { }
	public render(ctx: CanvasRenderingContext2D): void {
		this.obj.render(ctx);
	}
}

export class HoverColorComponent extends RenderComponent implements IUpdatable {
	private color: string;
	constructor(obj: IRenderable, private hovercolor: string, private basecolor: string) {
		super(obj);
		this.color = basecolor;
	}
	public update(dt: number): void {
		if (dt === 1) {
			this.color = this.hovercolor;
		} else {
			this.color = this.basecolor;
		}
	}
}

export class Element2 {
	private components: Map<string, IComponent> = new Map<string, IComponent>();
	public flags: ElementFlag = ElementFlag.None;
	public add(component: IComponent): void {
		this.components.set(component.name, component);
		this.flags = this.flags | component.flags;
	}
}

export abstract class Element {
	public collisions: Element[] = new Array<Element>();
	protected processedCollisions: Element[] = new Array<Element>(); // todo change to screen or collision system.  This is per type and not accurate
	public vector: Vector = new Vector(0, 0);

	constructor(
		public container: ElementContainer,
		public spritePool: SpritePool,
		public type: ElementType,
		public renderArea: IShape,
		public collisionArea: IShape,
		public zIndex: number,
		public collisionFilter: ElementType
	) {
	}

	public getzIndex(): number {
		return this.zIndex;
	}

	public onCollide(element: Element, on: boolean): void {
		this.processedCollisions.push(element);
		element.processedCollisions.push(this);
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
		if (type === "render") {
			this.container.verifyRenderIndex(this);
		}
	}

	public update(step: number): void {
		// to override
	}

	public postUpdate(): void {
		if (this.renderArea.changed()) {
			this.container.change(this, true);
		}
		this.processedCollisions = new Array<Element>();
	}

	public postRender(): void {
		this.renderArea.clearChanged();
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

}