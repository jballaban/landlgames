import { Component } from "./Component";
import { Scene } from "./Scene";
import { TransformComponent } from "../Components/TransformComponent";
import { EventHandler } from "./EventHandler";
import { Logger } from "../Utils/Logger";
import { IEventManager } from "./IEventManager";

export class Entity {
	private components = new Map<string, Component>();
	private entities: Entity[] = new Array<Entity>();
	public events: EventHandler = new EventHandler();
	protected parent: Entity = null;

	public constructor() {
		this.registerComponent(new TransformComponent());
	}

	public get transform(): TransformComponent {
		return this.getComponent<TransformComponent>(TransformComponent);
	}

	public registerEntity(entity: Entity): Entity {
		this.entities.push(entity);
		entity.onAttach(this);
		this.events.fire("registerEntity", entity);
		return entity;
	}

	public registerRecursiveEvents(eventmanager: IEventManager): void {
		let components: Component[] = Array.from(this.components.values());
		for (let i = 0; i < components.length; i++) {
			eventmanager.registerEvents(components[i]);
		}
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].registerRecursiveEvents(eventmanager);// recursive
		}
		this.events.listen("registerComponent", eventmanager.registerEvents.bind(eventmanager));
		this.events.listen("registerEntity", function (entity) {
			entity.registerRecursiveEvents(eventmanager);
		}.bind(eventmanager));
	}

	public onAttach(parent: Entity | Scene): void {
		if (parent instanceof Entity) {
			this.parent = parent;
		}
	}

	public getComponent<T extends Component>(type: Function): T {
		return this.components.get(type.name) as T;
	}

	public getAncestorComponent<T extends Component>(type: Function): T {
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

