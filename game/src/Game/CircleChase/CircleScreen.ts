import { Screen } from "../../Core/Screen";
import { Rectangle } from "../../Shape/Rectangle";
import { Camera } from "../../Core/Camera";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../../Shape/Polygon";
import { Point, MidPoint } from "../../Shape/Point";
import { Thing, StaticThing } from "../../UI/Thing";
import { ContextLayer } from "../../Core/ContextLayer";
import { Mouse } from "../../IO/Mouse";
import { Color } from "../../Util/Color";
import { ElementContainer } from "../../Core/ElementContainer";
import { Vector } from "../../Core/Vector";
import { Circle } from "../../Shape/Circle";
import { BasicMouse } from "../../IO/BasicMouse";
import { Cursor, MouseHandler, CursorState } from "../../IO/MouseHandler";
import { Element } from "../../Core/Element";
import { IShape } from "../../Shape/IShape";
import { BackgroundImage } from "../../UI/BackgroundImage";
import { Sprite } from "../../UI/Sprite";

export class CircleScreen extends Screen {

	private background: BackgroundImage;

	public constructor() {
		super(256, new Rectangle(new Point(0, 0), new Point(0, 0)));
	}

	public preload(): void {
		this.spritePool.register("Circle:background", new Sprite("background.jpg", 1920, 1200));
		StaticThing.preload(this.spritePool);
	}

	public activate(): void {
		super.activate();
		this.container.register(new BackgroundImage(
			"Circle:background",
			this.container,
			this.spritePool,
			this.viewport,
			true
		));
		for (var i: number = 0; i < 100; i++) {
			var position: Point = new Point(Math.random() * this.container.area.width(), Math.random() * this.container.area.height());
			var area: IShape = Math.floor(Math.random() * 2) === 1 ?
				new Rectangle(position, new Point(Math.floor(Math.random() * 10) + 10, Math.floor(Math.random() * 10) + 10, position))
				: new Circle(position, Math.floor(Math.random() * 10) + 10);
			var thing: Thing = new Thing(
				this.container,
				this.spritePool,
				Color.makeRGBA(Color.getRandomRGB(), 0.8),
				area, area);
			this.container.register(thing);
		}
		this.container.register(new StaticThing(
			this.container,
			this.spritePool,
			new Circle(new MidPoint(
				this.viewport.area.topLeft,
				this.viewport.area.bottomRight
			), 300)
		));
	}

	public preUpdate(): void {
		super.preUpdate();
		if (this.viewport.area.changed()) {
			this.container.resize(this.viewport.area);
		}
	}

	public update(dt: number): void {
		var cursors: Cursor[] = Array.from(MouseHandler.cursors.values());
		for (var i: number = 0; i < cursors.length; i++) {
			switch (cursors[i].state) {
				case CursorState.added:
					cursors[i].data = new BasicMouse(this.container, this.spritePool, cursors[i].x, cursors[i].y);
					this.container.register(cursors[i].data);
					break;
				case CursorState.moved:
					var x: number = Math.max(0, Math.min(this.camera.area.x2(), this.container.area.x2(), cursors[i].x));
					var y: number = Math.max(0, Math.min(this.camera.area.y2(), this.container.area.y2(), cursors[i].y));
					if (x !== cursors[i].x || y !== cursors[i].y) {
						MouseHandler.inc(cursors[i].id, x - cursors[i].x, y - cursors[i].y);
					}
					cursors[i].data.move("render", x, y);
					cursors[i].data.move("collision", x, y);
					break;
				case CursorState.remove:
					this.container.deregister(cursors[i].data);
					break;
			}
		}
		super.update(dt);
	}
}