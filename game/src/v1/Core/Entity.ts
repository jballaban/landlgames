import { Component } from "./Component";
import { ManagedCollection } from "../Foundation/ManagedCollection";
import { Vector, Vector2D } from "./Vector";

export interface IAttributeComposer {

	(obj1: any, obj2: any): any;

}

export class Composer {

	public static Vector2DAdd(obj1: Vector2D, obj2: Vector2D): Vector2D {
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
	public attributes: Map<string, any> = new Map<string, any>();

	constructor() {
		this.attributes.set("origin", new Vector2D(0, 0));
		this.attributes.set("scaleX", 1);
		this.attributes.set("scaleY", 1);
		this.attributes.set("rotateZ", 0);
	}

	public update(seconds: number): void {
		for (let i = 0; i < this.components.length; i++) {
			this.components[i].update(seconds);
		}
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].update(seconds);
		}
	}

	public getCalculatedAttribute<T>(name: string, composer: IAttributeComposer): T {
		if (this.parent == null) {
			return this.attributes.get(name);
		}
		return composer(this.parent.getCalculatedAttribute<T>(name, composer), this.attributes.get(name));
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

}