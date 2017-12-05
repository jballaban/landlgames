import { Screen } from "../../v0/Core/Screen";
import { Rectangle } from "../../v0/Shape/Rectangle";
import { Camera } from "../../v0/Core/Camera";
import { Runtime } from "v0/Core/Runtime";
import { Logger } from "v0/Util/Logger";
import { Position } from "../../v0/Shape/Polygon";
import { Point, MidPoint } from "../../v0/Shape/Point";
import { Thing, StaticThing } from "../../v0/UI/Thing";
import { ContextLayer } from "../../v0/Core/ContextLayer";
import { Mouse } from "../../v0/IO/Mouse";
import { Color } from "../../v0/Util/Color";
import { ElementContainer } from "../../v0/Core/ElementContainer";
import { Vector } from "../../v0/Core/Vector";
import { Circle } from "../../v0/Shape/Circle";
import { BasicMouse } from "../../v0/IO/BasicMouse";
import { Cursor, MouseHandler, CursorState } from "../../v0/IO/MouseHandler";
import { Element } from "../../v0/Core/Element";
import { IShape } from "../../v0/Shape/IShape";
import { BackgroundImage } from "../../v0/UI/BackgroundImage";
import { Sprite } from "../../v0/UI/Sprite";
import { Collision } from "../../v0/Util/Collision";

export class CircleScreen extends Screen {

	private background: BackgroundImage;
	private staticThing: StaticThing;

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
		for (var i: number = 0; i < 50; i++) {
			var position: Point = new Point(Math.random() * this.container.area.width(), Math.random() * this.container.area.height());
			var area: IShape = false && Math.floor(Math.random() * 2) === 1 ?
				new Rectangle(position, new Point(Math.floor(Math.random() * 10) + 10, Math.floor(Math.random() * 10) + 10, position))
				: new Circle(position, Math.floor(Math.random() * 30) + 10);
			var thing: Thing = new Thing(
				this.container,
				this.spritePool,
				Color.makeRGBA(Color.getRandomRGB(), 0.8),
				area, area);
			thing.vector = new Vector(Math.random() * 80 - 40, Math.random() * 80 - 40);
			this.container.register(thing);
		}
		thing = new Thing(
			this.container,
			this.spritePool,
			Color.makeRGBA(Color.getRandomRGB(), 0.8),
			new Circle(new Point(200, 200), 20),
			new Circle(new Point(200, 200), 20)
		);
		thing.vector = new Vector(20, 0);
		this.container.register(thing);
		thing = new Thing(
			this.container,
			this.spritePool,
			Color.makeRGBA(Color.getRandomRGB(), 0.8),
			new Circle(new Point(300, 200), 10),
			new Circle(new Point(300, 200), 10)
		);
		thing.vector = new Vector(-80, 0);
		this.container.register(thing);
		this.staticThing = new StaticThing(
			this.container,
			this.spritePool,
			new Circle(new MidPoint(
				this.viewport.area.topLeft,
				this.viewport.area.bottomRight
			), 300));
		this.container.register(this.staticThing);
	}

	public preUpdate(): void {
		super.preUpdate();
		if (this.viewport.area.changed()) {
			this.container.resize(this.viewport.area);
			if (this.staticThing != null) {
				this.staticThing.updateRadius(
					Math.floor(Math.min(this.viewport.area.height() / 3, this.viewport.area.width() / 3))
				);
			}
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