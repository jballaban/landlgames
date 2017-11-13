import { Sprite } from "./Sprite";
import { ElementContainer } from "../Core/ElementContainer";
import { Viewport } from "../Core/Viewport";
import { Element } from "../Core/Element";
import { ElementType } from "../Core/ElementType";
import { Point, MidPoint } from "../Shape/Point";
import { Rectangle } from "../Shape/Rectangle";

export class BackgroundImage extends Element {

	private image: Sprite;
	private viewport: Viewport;

	constructor(image: Sprite, container: ElementContainer, viewport: Viewport) {
		var topleft = new Point(-512, -512, new MidPoint(viewport.area.topLeft, viewport.area.bottomRight));
		var bottomright = new Point(1024, 1024, topleft);
		super(container, ElementType.backgroundImage, new Rectangle(topleft, bottomright), 1, null);
		this.image = image;
		this.viewport = viewport;
	}

	public ready(): boolean {
		return super.ready() && this.image.loaded;
	}

	public areaAsRect(): Rectangle {
		return this.area as Rectangle;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.image.render(ctx, this.areaAsRect().topLeft.x(), this.areaAsRect().topLeft.y(), this.areaAsRect().width(), this.areaAsRect().height());
	}

}