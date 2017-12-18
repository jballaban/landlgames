import { Logger } from "../Utils/Logger";

export class EventHandler {
	protected _mappings: Map<string, Function[]> = new Map<string, Function[]>();

	public has(name: string, fn?: Function): boolean {
		return this._mappings.has(name)
			&& this._mappings.get(name).length > 0
			&& (fn == null || this._mappings.get(name).indexOf(fn) > -1);
	}

	public fire(name: string, ...args: any[]): void {
		let values: Function[] = this._mappings.get(name);
		if (values == null) { return; }
		for (let i: number = 0; i < values.length; i++) {
			values[i](...args);
		}
	}

	public listen(name: string, fn: Function): void {
		if (this.has(name, fn)) { return; }
		if (this._mappings.get(name) == null) { this._mappings.set(name, new Array<Function>()); }
		this._mappings.get(name).push(fn);
	}

	public forget(name: string, fn: Function): void {
		if (!this.has(name, fn)) { return; }
		let arr: Function[] = this._mappings.get(name);
		arr.splice(arr.indexOf(fn), 1);
		if (arr.length === 0) { this._mappings.delete(name); }
	}
}

export class HierarchyEventHandler extends EventHandler {
	private parent: HierarchyEventHandler;

	public registerParent(parent: HierarchyEventHandler): void {
		this.parent = parent;
		for (let key of this._mappings.keys()) {
			for (let fn of this._mappings.get(key)) {
				this.parent.listen(key, fn);
			}
		}
	}

	public listen(name: string, fn: Function): void {
		super.listen(name, fn);
		if (this.parent != null) {
			this.parent.listen(name, fn);
		}
	}

	public forget(name: string, fn: Function): void {
		super.forget(name, fn);
		if (this.parent != null) {
			this.parent.forget(name, fn);
		}
	}

}
/*
export class DependentEventHandler extends EventHandler {
	private dependentHandlers: EventHandler[] = new Array<EventHandler>();

	public registerHandler(handler: EventHandler): void {
		this.dependentHandlers.push(handler);
	}

	public remove(handler: EventHandler): void {
		this.dependentHandlers.splice(this.dependentHandlers.indexOf(handler), 1);
	}

	public fire(name: string, ...args: any[]): void {
		super.fire(name, args);
		for (let i: number = 0; i < this.dependentHandlers.length; i++) {
			this.dependentHandlers[i].fire(name, args);
		}
	}
} */