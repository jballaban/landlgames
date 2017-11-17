// tslint:disable:no-bitwise
import { Mouse } from "../IO/Mouse";
import { Element } from "../Core/Element";
import { Camera } from "../Core/Camera";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { Point } from "../Shape/Point";
import { Vector } from "../Core/Vector";
import { IShape } from "../Shape/IShape";
import { Circle } from "../Shape/Circle";
import { Logger } from "../Util/Logger";
import { Color } from "../Util/Color";
import { Runtime } from "../Core/Runtime";
import { ElementType } from "../Core/ElementType";
import { Screen } from "../Core/Screen";
import { ElementContainer } from "../Core/ElementContainer";
import { Shadow } from "../Shape/Shadow";
import { BackgroundImage } from "./BackgroundImage";
import { Sprite } from "./Sprite";
import { SpritePool } from "../Core/SpritePool";
import { Collision } from "../Util/Collision";
import { Physics } from "../Core/Physics";

export class StaticThing extends Element {
	private win: boolean = false;
	private playSprite: Sprite;
	private winSprite: Sprite;

	constructor(container: ElementContainer, spritepool: SpritePool, area: Circle) {
		super(container, spritepool, ElementType.StaticThing, new Shadow(area, 100), area, 10000, ElementType.Thing);
		this.winSprite = spritepool.get("Circle:StaticThing:win");
		this.playSprite = spritepool.get("Circle:StaticThing:play");
	}

	public static preload(spritePool: SpritePool): void {
		spritePool.register("Circle:StaticThing:win", new Sprite("win.jpg", 1024, 662));
		spritePool.register("Circle:StaticThing:play", new Sprite("maincircle.jpg", 1600, 1064));
	}


	public updateRadius(r: number): void {
		((this.renderArea as Shadow).childArea as Circle).r = r;
		(this.renderArea as Shadow).resize();
		(this.collisionArea as Circle).r = r;
		this.container.change(this, true);
	}

	public onCollide(element: Element, on: boolean): void {
		if (on && this.win) {
			this.win = false;
			this.container.change(this, false);
		} else if (!on && !this.win && this.collisions.length === 0) {
			this.win = true;
			this.container.change(this, false);
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.beginPath();
		this.renderArea.render(ctx, "rgb(10,10,10)");
		ctx.clip();
		if (this.win) {
			this.winSprite.render(
				ctx,
				this.renderArea.origin.x() - this.winSprite.width / 2,
				this.renderArea.origin.y() - this.winSprite.height / 2,
				this.winSprite.width, this.winSprite.height
			);
		} else {
			this.playSprite.render(
				ctx,
				this.renderArea.origin.x() - this.winSprite.width / 2,
				this.renderArea.origin.y() - this.winSprite.height / 2,
				this.winSprite.width, this.winSprite.height
			);
		}
		ctx.restore();
	}
}

export class Thing extends Element {
	private _color: string;
	public acceleration: number;
	public minSpeed: number;
	public maxSpeed: number;
	private static _instances: number = 0;

	constructor(container: ElementContainer, spritepool: SpritePool, private color: string, renderarea: IShape, collisionarea: IShape) {
		super(
			container,
			spritepool,
			ElementType.Thing,
			new Shadow(renderarea, 10),
			collisionarea,
			20000 + (++Thing._instances),
			ElementType.StaticThing | ElementType.Mouse | ElementType.Thing
		);
		this._color = color;
		this.acceleration = -1;
	}

	public update(dt: number): void {
		//this.acceleration -= 1 * dt;
		this.vector.multiply(1 - (0.5 * dt)); // friction
		var move: Vector = this.vector.clone().multiply(dt); //addScalar(this.acceleration * dt);
		if (move.magnitude() < 1) {
			this.vector = new Vector(0, 0);
		} else {
			this.inc(move.x, move.y);
			if (this.renderArea.origin.x() <= 0 || this.renderArea.origin.x() >= this.container.area.width()) {
				this.vector.x *= -1;
				this.inc(move.x, move.y);
			}
			if (this.renderArea.origin.y() <= 0 || this.renderArea.origin.y() >= this.container.area.height()) {
				this.vector.y *= -1;
				this.inc(move.x, move.y);
			}
		}
		super.update(dt);
	}

	public onCollide(element: Element, on: boolean): void {
		if ((element.type & ElementType.StaticThing) !== 0) {
			if (on) {
				this.color = "rgba(255,255,255,0.5)";
				this.container.change(this, false);
			} else {
				this.color = this._color;
				this.container.change(this, false);
			}
		}
		if (
			on
			&& this.processedCollisions.indexOf(element) === -1
			&& ((element.type & ElementType.Thing) !== 0)
		) {
			Physics.collide(this, element);
		}
		super.onCollide(element, on);
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.renderArea.render(ctx, this.color);
	}
}