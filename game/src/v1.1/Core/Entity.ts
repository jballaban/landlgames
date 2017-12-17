import { Component } from "./Component";
import { Scene } from "./Scene";
import { TransformComponent } from "../Components/TransformComponent";
import { EventHandler, HierarchyEventHandler } from "./EventHandler";
import { Logger } from "../Utils/Logger";
import { PreRenderComponent } from "../Components/PreRenderComponent";

export class Entity {
	public parent: Entity = null;
	private entities: Entity[] = new Array<Entity>();
	public events: HierarchyEventHandler = new HierarchyEventHandler();
	private components: Set<Component> = new Set<Component>();
	public transform: TransformComponent;
	private prerenders: PreRenderComponent[] = new Array<PreRenderComponent>();

	public constructor() {
		this.transform = this.registerComponent(new TransformComponent()) as TransformComponent;
	}

	public getAncestor<T extends Entity>(type: Function): T {
		if (this.parent == null) { return null; }
		if (this.parent instanceof type) { return this.parent as T; }
		return this.parent.getAncestor<T>(type);
	}

	public getChildren<T extends Entity>(type: Function): T[] {
		let result: T[] = new Array<T>();
		for (let i = 0; i < this.entities.length; i++) {
			if (this.entities[i] instanceof type) {
				result.push(this.entities[i] as T);
			}
		}
		return result;
	}

	public registerEntity(entity: Entity): any {
		this.entities.push(entity);
		entity.onAttach(this);
		return entity;
	}

	public onAttach(parent: Entity): void {
		this.parent = parent;
		this.events.registerParent(parent.events);
	}

	public preRenderInit(ctx: CanvasRenderingContext2D): void {
		if (this.parent != null) { this.parent.preRenderInit(ctx); }
		for (let i: number = 0; i < this.prerenders.length; i++) {
			this.prerenders[i].init(ctx);
		}
	}

	public preRenderApply(ctx: CanvasRenderingContext2D): void {
		if (this.parent != null) { this.parent.preRenderApply(ctx); }
		for (let i: number = 0; i < this.prerenders.length; i++) {
			this.prerenders[i].apply(ctx);
		}
	}

	public registerComponent(component: Component): Component {
		this.components.add(component);
		component.onAttach(this);
		if (component instanceof PreRenderComponent) {
			this.prerenders.push(component);
		}
		return component;
	}

	public getComponent<T extends Component>(type: Function): T {
		let values: Component[] = Array.from(this.components.values());
		for (let i = 0; i < values.length; i++) {
			if (values[i] instanceof type) {
				return values[i] as T;
			}
		}
		return null;
	}

	public getComponents<T extends Component>(type: Function): T[] {
		let values: Component[] = Array.from(this.components.values());
		let result: Component[] = new Array<Component>();
		for (let i = 0; i < values.length; i++) {
			if (values[i] instanceof type) {
				result.push(values[i]);
			}
		}
		return result as T[];
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

}