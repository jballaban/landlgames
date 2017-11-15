import { Screen } from "../Core/Screen";
import { Rectangle } from "../Shape/Rectangle";
import { Camera } from "../Core/Camera";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../Shape/Polygon";
import { Point, MidPoint } from "../Shape/Point";
import { Thing, StaticThing } from "../UI/Thing";
import { ContextLayer } from "../Core/ContextLayer";
import { Mouse } from "../IO/Mouse";
import { Color } from "../Util/Color";
import { ElementContainer } from "../Core/ElementContainer";
import { Vector } from "../Core/Vector";
import { Circle } from "../Shape/Circle";
import { MouseHandler, CursorState, Cursor } from "../IO/MouseHandler";
import { BasicMouse } from "../IO/BasicMouse";
import { Element } from "../Core/Element";
import { ElementType } from "../Core/ElementType";
import { Viewport } from "../Core/Viewport";
import { Sprite } from "../UI/Sprite";
import { BackgroundImage } from "../UI/BackgroundImage";
import { Action } from "../Util/Action";
import { Duration } from "../Util/Duration";

export class LoadingScreen extends Screen {
	private selfPreloaded: boolean = false;

	public constructor(private screen: Screen) {
		super(256, new Rectangle(new Point(0, 0, null), new Point(0, 0, null)));
	}

	public activate(): void {
		super.activate();
		this.spritePool.register("Loading:Logo", new Sprite("logo.png", 1024, 1024));
		this.screen.preload();
	}

	public preUpdate(): void {
		super.preUpdate();
		if (this.viewport.area.changed()) {
			this.container.resize(this.viewport.area);
		}
		if (this.spritePool.ready()) {
			if (!this.selfPreloaded) {
				this.container.register(
					new BackgroundImage(
						"Loading:Logo",
						this.container,
						this.spritePool,
						this.viewport,
						false
					)
				);
				this.selfPreloaded = true;
				this.screen.preload();
			} else if{

			}
		}
		if (this.screen.spritePool.ready()) {

		}
	}

	private loadScreen(): void {
		Runtime.nextScreen = this.screen;
	}

}