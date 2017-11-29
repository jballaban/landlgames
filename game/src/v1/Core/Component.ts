import { Entity } from "./Entity";
import { Vector3D } from "./Vector";
import { IShape } from "../Foundation/IShape";
import { Model } from "./Model";

export abstract class Component {
	public entity: Entity;
	public onAttach(entity: Entity): void {
		this.entity = entity;
	}
}

export class RenderComponent extends Component {
	public shape: IShape;

	constructor(shape: IShape) {
		super();
		this.shape = shape;
	}
	public draw(ctx: CanvasRenderingContext2D, cameraOrigin: Vector3D, cameraScale: Vector3D, cameraRotate: Vector3D) {
		let position: Vector3D = this.entity.getEffectiveOrigin(cameraOrigin, cameraScale.x, cameraRotate.z);
		let angle: number = this.entity.getEffectiveRotateZ(cameraRotate.z);
		ctx.save();
		if ((this.entity as Model).getEffectiveAlpha() !== 1) {
			ctx.globalAlpha = (this.entity as Model).getEffectiveAlpha();
		}
		ctx.translate(position.x, position.y);
		if (angle !== 0) {
			ctx.rotate(angle * Math.PI / 180);
		}
		let scale: number = this.entity.getEffectiveScale(cameraScale.x);
		if (scale !== 1) {
			ctx.scale(scale, scale);
		}
		ctx.shadowBlur = 20;
		ctx.shadowColor = "rgb(0,0,0)";
		(this.entity as Model).render(ctx);
		ctx.restore();
	}
}

export class TransformComponent extends Component {
	public origin: Vector3D = new Vector3D(0, 0, 0);
	public scale: Vector3D = new Vector3D(1, 1, 1);
	public rotate: Vector3D = new Vector3D(0, 0, 0);
}