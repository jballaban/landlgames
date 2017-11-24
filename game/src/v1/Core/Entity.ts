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

export class Entity {

	public parent: Entity = null;
	private components: Component[] = new Array<Component>();
	public entities: Entity[] = new Array<Entity>();
	private attributes: Map<string, any> = new Map<string, any>();

	constructor() {
		this.attributes.set("origin", new Vector3D(0, 0, 0));
		this.attributes.set("rotateZ", 0);
		this.attributes.set("scale", 1);
	}

	public get effectiveOrigin(): Vector3D {
		return this.getCalculatedAttribute<Vector3D>("effectiveOrigin", Composer.Vector3DAdd);
	}

	public get rotateZ(): number {
		return this.getAttribute<number>("rotateZ");
	}

	public set rotateZ(value: number) {
		this.attributes.set("rotateZ", value);
	}

	public get scale(): number {
		return this.getAttribute<number>("scale");
	}

	public set scale(value: number) {
		this.attributes.set("scale", value);
	}

	public get origin(): Vector3D {
		return this.getAttribute<Vector3D>("origin");
	}

	public set origin(value: Vector3D) {
		this.attributes.set("origin", value);
	}

	public update(): void {
		for (let i = 0; i < this.components.length; i++) {
			this.components[i].update();
		}
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].update();
		}
	}

	protected getCalculatedAttribute<T>(name: string, composer: IAttributeComposer): T {
		if (this.parent == null) {
			return this.getAttribute<T>(name);
		}
		return composer(this.parent.getCalculatedAttribute<T>(name, composer), this.getAttribute<T>(name));
	}

	protected setAttribute(name: string, value: any): void {
		this.attributes.set(name, value);
	}

	protected getAttribute<T>(name: string): T {
		if (name === "effectiveOrigin") {
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