import { Component } from "./Component";
import { Scene } from "./Scene";
import { TransformComponent } from "../Components/TransformComponent";
import { EventHandler } from "./EventHandler";
import { Logger } from "../Utils/Logger";
import { AlphaComponent } from "../Components/AlphaComponent";

export class Entity {
	private components = new Map<string, Component>();
	private entities: Entity[] = new Array<Entity>();
	public events: EventHandler = new EventHandler();
	public transform: TransformComponent;
	public parent: Entity = null;

	public constructor() {
		this.transform = this.registerComponent(new TransformComponent()) as TransformComponent;
	}

	public registerEntity<T extends Entity>(entity: T): T {
		this.entities.push(entity);
		entity.onAttach(this);
		this.events.fire("registerEntity", entity);
		return entity;
	}

	public preRender(ctx: CanvasRenderingContext2D): void {
		//	this.transform.apply(ctx);
		if (this.parent != null) {
			this.parent.preRender(ctx);
		}
		this.events.fire("preRender", ctx);
	}

	public registerRecursiveEvents(events: EventHandler): void {
		let components: Component[] = Array.from(this.components.values());
		for (let i = 0; i < components.length; i++) {
			components[i].registerEvents(events);
		}
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].registerRecursiveEvents(events);// recursive
		}
		this.events.listen("registerComponent", function (component) {
			component.registerEvents(events);
		}.bind(events));
		this.events.listen("registerEntity", function (entity) {
			entity.registerRecursiveEvents(events);
		}.bind(events));

	}

	public onAttach(parent: Entity | Scene): void {
		if (parent instanceof Entity) {
			this.parent = parent;
		}
	}

	public getComponent<T extends Component>(type: Function): T {
		return this.components.get(type.name) as T;
	}

	public getAncestor<T extends Entity>(type: Function): T {
		if (this.parent == null) {
			return null;
		}
		if (this.parent instanceof type) {
			return this.parent as T;
		}
		return this.parent.getAncestor<T>(type);
	}

	public getAncestorComponent<T extends Component>(type: Function, includeSelf?: boolean): T {
		if (includeSelf != null && includeSelf) {
			let result = this.getComponent<T>(type);
			if (result != null)
				return result;
		}
		if (this.parent == null) {
			return null;
		}
		if (this.parent.getComponent<T>(type) != null) {
			return this.parent.getComponent<T>(type);
		}
		return this.parent.getAncestorComponent<T>(type);
	}

	public registerComponent(component: Component): Component {
		this.components.set(component.constructor.name, component);
		component.onAttach(this);
		this.events.fire("registerComponent", component);
		return component;
	}

}

