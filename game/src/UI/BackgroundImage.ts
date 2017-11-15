import { Sprite } from "./Sprite";
import { ElementContainer } from "../Core/ElementContainer";
import { Viewport } from "../Core/Viewport";
import { Element } from "../Core/Element";
import { ElementType } from "../Core/ElementType";
import { Point, MidPoint } from "../Shape/Point";
import { Rectangle, PointRectangle } from "../Shape/Rectangle";
import { Logger } from "../Util/Logger";
import { SpritePool } from "../Core/SpritePool";

export class BackgroundImage extends Element {

	private viewport: Viewport;
	private resized: boolean = false;

	constructor(private sprite: string, container: ElementContainer, spritepool: SpritePool, viewport: Viewport, private fill: boolean) {
		super(container, spritepool, ElementType.backgroundImage, BackgroundImage.getArea(viewport, fill), null, 1, null);
		this.viewport = viewport;
	}

	public update(dt: number): void {
		if (this.viewport.area.changed() || !this.resized) {
			this.renderArea = BackgroundImage.getArea(this.viewport, this.fill);
			this.resized = this.renderAreaAsRect().width() > 0;
		}
	}

	private static getArea(viewport: Viewport, fill: boolean): Rectangle {
		if (fill) { return viewport.area; }
		var center: Point = new MidPoint(viewport.area.topLeft, viewport.area.bottomRight);
		var width: number = Math.min(viewport.area.width(), 1024);
		var height: number = Math.min(viewport.area.height(), 1024);
		var ratio: number = Math.min(width / 1024, height / 1024);
		var topleft: Point = new Point(-ratio * 1024 / 2, -ratio * 1024 / 2, center);
		var bottomright: Point = new Point(ratio * 1024, ratio * 1024, topleft);
		return new Rectangle(topleft, bottomright);
	}

	public renderAreaAsRect(): Rectangle {
		return this.renderArea as Rectangle;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.spritePool.get(this.sprite).render(
			ctx,
			this.renderAreaAsRect().topLeft.x(),
			this.renderAreaAsRect().topLeft.y(),
			this.renderAreaAsRect().width(),
			this.renderAreaAsRect().height()
		);
	}

}