import { Component } from "./Component";
import { ManagedCollection } from "../Foundation/ManagedCollection";
import { Vector3D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Composer, IAttributeComposer } from "../Foundation/Composer";

export interface IFrameStart {
	frameStart(): void;
}

export interface IPreUpdate {
	preUpdate(): void;
}

export interface IUpdate {
	update(): void;
}

export interface IPostUpdate {
	postUpdate(): void;
}

export class Entity {
	public parent: Entity = null;
	public components: Component[] = new Array<Component>();
	public entities: Entity[] = new Array<Entity>();
	private attributes: Map<string, any> = new Map<string, any>();

	constructor() {
		this.setAttribute("origin", new Vector3D(0, 0, 0));
		this.setAttribute("rotateZ", 0);
		this.setAttribute("scale", 1);
	}

	public getEffectiveRotateZ(cameraRotateZ: number): number {
		if (this.parent == null) {
			return this.getAttribute<number>("rotateZ") + cameraRotateZ;
		}
		return Composer.NumberAdd(this.parent.getEffectiveRotateZ(cameraRotateZ), this.getAttribute<number>("rotateZ"));
	}

	public getEffectiveScale(cameraScale: number): number {
		if (this.parent == null) {
			return this.getAttribute<number>("scale") * cameraScale;
		}
		return Composer.NumberMultiply(this.parent.getEffectiveScale(cameraScale), this.getAttribute<number>("scale"));
	}

	public getEffectiveOrigin(cameraOrigin: Vector3D, cameraScale: number, cameraRotateZ: number): Vector3D {
		let origin: Vector3D = this.getAttribute<Vector3D>("origin").clone()
		origin.multiply(this.parent == null ? cameraScale : this.parent.getEffectiveScale(cameraScale));
		let rads: number = (this.parent == null ? cameraRotateZ : this.parent.getEffectiveRotateZ(cameraRotateZ)) * Math.PI / 180;
		if (this.parent == null) {
			origin.subtract(cameraOrigin.clone().multiply(cameraScale));
		}
		let x: number = origin.x * Math.cos(rads) - origin.y * Math.sin(rads);
		let y: number = origin.x * Math.sin(rads) + origin.y * Math.cos(rads);
		origin.x = x;
		origin.y = y;
		return this.parent == null ? origin.add(cameraOrigin) : Composer.Vector3DAdd(origin, this.parent.getEffectiveOrigin(cameraOrigin, cameraScale, cameraRotateZ));
	}

	public get rotateZ(): number { return this.getAttribute<number>("rotateZ"); }

	public set rotateZ(value: number) {
		this.setAttribute("rotateZ", value);
	}

	public get scale(): number { return this.getAttribute<number>("scale"); }

	public set scale(value: number) {
		this.setAttribute("scale", value);
	}

	public get origin(): Vector3D { return this.getAttribute<Vector3D>("origin"); }

	public set origin(value: Vector3D) {
		this.setAttribute("origin", value);
	}

	protected setAttribute(name: string, value: any): void {
		this.attributes.set(name, value);
	}

	protected getAttribute<T>(name: string): T {
		return this.attributes.get(name);
	}

	protected getEffectiveAttribute<T>(name: string, composer: IAttributeComposer) {
		return this.parent == null ? this.getAttribute<T>(name) : composer(this.getAttribute<T>(name), this.parent.getEffectiveAttribute<T>(name, composer));
	}

	public onAttach(entity: Entity): void {
		this.parent = entity;
	}

	public registerComponent(component: Component): void {
		if (this.parent != null) {
			throw "Already registered do not modify.  If you need to modify change how registerevents works in world to happen after"
		}
		this.components.push(component);
		component.onAttach(this);
	}

	public registerEntity(entity: Entity): void {
		if (this.parent != null) {
			throw "Already registered do not modifyIf you need to modify change how registerevents works in world to happen after"
		}
		this.entities.push(entity);
		entity.onAttach(this);
	}

	public unregisterEntity(entity: Entity): void {
		this.entities.splice(this.entities.indexOf(entity), 1);
	}

}