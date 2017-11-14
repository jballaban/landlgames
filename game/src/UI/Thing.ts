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

export class StaticThing extends Element {
	private win: boolean = false;
	private winSprite: Sprite;

	constructor(container: ElementContainer, private color: string, area: Circle) {
		super(container, ElementType.StaticThing, new Shadow(area, 100), area, 4, ElementType.Thing);
		this.winSprite = new Sprite("win.jpg", 1024, 662);
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
		if (this.win) {
			ctx.save();
			ctx.beginPath();
			this.renderArea.render(ctx, this.color);
			ctx.clip();
			this.winSprite.render(
				ctx,
				this.renderArea.origin.x() - this.winSprite.width / 2,
				this.renderArea.origin.y() - this.winSprite.height / 2,
				this.winSprite.width, this.winSprite.height
			);
			ctx.restore();
		} else {
			this.renderArea.render(ctx, this.color);
		}
	}
}

export class Thing extends Element {
	private _color: string;
	public direction: Vector;
	public speed: number;
	public minSpeed: number;
	public maxSpeed: number;

	constructor(container: ElementContainer, private color: string, renderarea: IShape, collisionarea: IShape) {
		// tslint:disable-next-line:no-bitwise
		super(container, ElementType.Thing, new Shadow(renderarea, 10), collisionarea, 5, ElementType.StaticThing | ElementType.Mouse);
		this._color = color;
		this.direction = new Vector(0, 0);
		this.speed = 0;
		this.minSpeed = 0;
		this.maxSpeed = 10;
	}

	public update(dt: number): void {
		this.speed -= .1;
		this.speed = Math.max(this.minSpeed, this.speed);
		var move: Vector = this.direction.clone().multiply(dt * this.speed);
		this.inc(move.x, move.y);
		if (this.renderArea.origin.x() <= 0 || this.renderArea.origin.x() >= this.container.area.width()) {
			this.direction.x *= -1;
		}
		if (this.renderArea.origin.y() <= 0 || this.renderArea.origin.y() >= this.container.area.height()) {
			this.direction.y *= -1;
		}
		super.update(dt);
	}

	public onCollide(element: Element, on: boolean): void {
		if (this.color === this._color && this.collisions.length > 0) {
			this.color = "rgba(255,0,0,0.8)";
			this.container.change(this, false);
		} else if (this.color !== this._color && this.collisions.length === 0) {
			this.color = this._color;
			this.container.change(this, false);
		}
		if (on && (
			element.type === ElementType.Mouse
		)) {
			this.direction = new Vector(
				this.renderArea.origin.x() - element.renderArea.origin.x(),
				this.renderArea.origin.y() - element.renderArea.origin.y()
			);
			this.speed = Math.ceil(Math.random() * this.maxSpeed / 2) + this.maxSpeed / 2;
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.renderArea.render(ctx, this.color);
	}
}