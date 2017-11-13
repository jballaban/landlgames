import { Sprite } from "./Sprite";
import { ElementContainer } from "../Core/ElementContainer";
import { Viewport } from "../Core/Viewport";
import { Element } from "../Core/Element";
import { ElementType } from "../Core/ElementType";
import { Point, MidPoint } from "../Shape/Point";
import { Rectangle, PointRectangle } from "../Shape/Rectangle";
import { Logger } from "../Util/Logger";

export class BackgroundImage extends Element {

	private image: Sprite;
	private viewport: Viewport;
	private resized: boolean = false;

	constructor(image: Sprite, container: ElementContainer, viewport: Viewport) {
		super(container, ElementType.backgroundImage, BackgroundImage.getArea(viewport), null, 1, null);
		this.image = image;
		this.viewport = viewport;
	}

	public update(dt: number): void {
		if (this.viewport.area.changed() || !this.resized) {
			this.renderArea = BackgroundImage.getArea(this.viewport);
			this.resized = this.renderAreaAsRect().width() > 0;
		}
	}

	private static getArea(viewport: Viewport): Rectangle {
		var center = new MidPoint(viewport.area.topLeft, viewport.area.bottomRight);
		var width = Math.min(viewport.area.width(), 1024);
		var height = Math.min(viewport.area.height(), 1024);
		var ratio = Math.min(width / 1024, height / 1024);
		var topleft = new Point(-ratio * 1024 / 2, -ratio * 1024 / 2, center);
		var bottomright = new Point(ratio * 1024, ratio * 1024, topleft);
		return new Rectangle(topleft, bottomright);
	}

	public ready(): boolean {
		return super.ready() && this.image.loaded;
	}

	public renderAreaAsRect(): Rectangle {
		return this.renderArea as Rectangle;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.image.render(ctx, this.renderAreaAsRect().topLeft.x(), this.renderAreaAsRect().topLeft.y(), this.renderAreaAsRect().width(), this.renderAreaAsRect().height());
	}

}