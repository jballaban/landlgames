import { Thing } from "../UI/Thing";
import { Element } from "../Core/Element";
import { Rectangle, PointRectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";
import { ContextLayer } from "../Core/ContextLayer";
import { Circle } from "../Shape/Circle";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Camera } from "../Core/Camera";
import { ElementType } from "../Core/ElementType";
import { Vector } from "../Core/Vector";
import { Mouse } from "./Mouse";
import { ElementContainer } from "../Core/ElementContainer";
import { Shadow } from "../Shape/Shadow";
import { SpritePool } from "../Core/SpritePool";
import { Collision } from "../Util/Collision";

export class BasicMouse extends Mouse {
	private color: string;

	public constructor(container: ElementContainer, spritePool: SpritePool, x: number, y: number) {
		var renderarea: Circle = new Circle(new Point(x, y), 50);
		var collisionarea: Circle = new Circle(new Point(x, y), 50);
		super(container, spritePool, new Shadow(renderarea, 20), collisionarea, 10, ElementType.Thing);
		this.color = "rgba(255,255,255,0.5)";
	}

	public update(dt: number): void {
		super.update(dt);
		Logger.log("update");
		for (var i = 0; i < this.collisions.length; i++) {
			if ((this.collisions[i].type & ElementType.Thing) !== 0) {
				this.collisions[i].vector.multiply(1 + (1 * dt));
			}
		}
	}

	public onCollide(element: Element, on: boolean): void {
		if (
			on && ((element.type & ElementType.Thing) !== 0)
		) {
			element.vector = element.collisionArea.origin.vector.clone().subtract(this.collisionArea.origin.vector).normalize();
			element.vector.multiply(200);
		}
		super.onCollide(element, on);
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.renderArea.render(ctx, this.color);
	}

}