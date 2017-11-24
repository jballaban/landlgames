import { Component } from "./Component";
import { ManagedCollection } from "../Foundation/ManagedCollection";
import { Vector3D } from "./Vector";
import { Logger } from "../Util/Logger";

export interface IAttributeComposer {
	(obj1: any, obj2: any): any;
}

export class Composer {
	public static Vector3DAdd(obj1: Vector3D, obj2: Vector3D): Vector3D {
		if (obj2 == null) {
			return obj1;
		}
		if (obj1 == null) {
			return obj2;
		}
		return obj1.clone().add(obj2);
	}

	public static BooleanOr(obj1: boolean, obj2: boolean): boolean {
		if (obj2 == null) {
			return obj1;
		}
		if (obj1 == null) {
			return obj2;
		}
		return obj1 || obj2;
	}

	public static NumberMultiply(obj1: number, obj2: number): number {
		if (obj2 == null) {
			return obj1;
		}
		if (obj1 == null) {
			return obj2;
		}
		return obj1 * obj2;
	}

	public static NumberAdd(obj1: number, obj2: number): number {
		if (obj2 == null) {
			return obj1;
		}
		if (obj1 == null) {
			return obj2;
		}
		return obj1 + obj2;
	}

	public static Latest(obj1: any, obj2: any): any {
		if (obj2 == null) {
			return obj1;
		}
		return obj2;
	}
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
		this.setAttribute("positionChanged", true);
	}

	public get positionChanged(): boolean { return this.getCalculatedAttribute<boolean>("positionChanged", Composer.BooleanOr); }

	public set positionChanged(value: boolean) {
		this.setAttribute("positionChanged", value);
	}

	public get effectiveOrigin(): Vector3D {
		if (this.positionChanged) {
			this.setAttribute("effectiveOrigin", this.getCalculatedAttribute<Vector3D>("origin", Composer.Vector3DAdd));
		}
		return this.getAttribute<Vector3D>("effectiveOrigin");
	}

	public get rotateZ(): number { return this.getAttribute<number>("rotateZ"); }

	public set rotateZ(value: number) {
		this.setAttribute("rotateZ", value);
		this.positionChanged = true;
	}

	public get scale(): number { return this.getAttribute<number>("scale"); }

	public set scale(value: number) {
		this.setAttribute("scale", value);
		this.positionChanged = true;
	}

	public get origin(): Vector3D { return this.getAttribute<Vector3D>("origin"); }

	public set origin(value: Vector3D) {
		this.setAttribute("origin", value);
		this.positionChanged = true;
	}

	protected getCalculatedAttribute<T>(name: string, composer: IAttributeComposer): T {
		if (this.parent == null) {
			return this.calcAttribute<T>(name);
		}
		return composer(this.parent.getCalculatedAttribute<T>(name, composer), this.calcAttribute<T>(name));
	}

	protected setAttribute(name: string, value: any): void {
		this.attributes.set(name, value);
	}

	protected getAttribute<T>(name: string): T {
		return this.attributes.get(name);
	}

	private calcAttribute<T>(name: string): T {
		if (name === "origin") {
			let origin: Vector3D = this.attributes.get("origin").clone();
			origin.multiply(this.parent == null ? 1 : this.parent.getCalculatedAttribute<number>("scale", Composer.NumberMultiply));
			let rads: number = this.parent == null ? 0 : this.parent.getCalculatedAttribute<number>("rotateZ", Composer.NumberAdd) * Math.PI / 180;
			let x: number = origin.x * Math.cos(rads) - origin.y * Math.sin(rads);
			let y: number = origin.x * Math.sin(rads) + origin.y * Math.cos(rads);
			origin.x = x;
			origin.y = y;
			return origin as any;
		}
		return this.attributes.get(name);
	}

	public onAttach(entity: Entity): void {
		this.parent = entity;
	}

	public registerComponent(component: Component): void {
		this.components.push(component);
		component.onAttach(this);
	}

	public registerEntity(entity: Entity): void {
		this.entities.push(entity);
		entity.onAttach(this);
	}

	public unregisterEntity(entity: Entity): void {
		this.entities.splice(this.entities.indexOf(entity), 1);
	}

}