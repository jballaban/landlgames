import { Logger } from "../Utils/Logger";

export class EventHandler {
	private _mappings: Map<string, Function[]> = new Map<string, Function[]>();

	public has(name: string): boolean {
		return this._mappings.has(name) && this._mappings.get(name).length > 0;
	}

	public get(name: string): Function[] {
		return this._mappings.get(name);
	}

	public fire(name: string, ...args: any[]): void {
		let values: Function[] = this._mappings.get(name);
		if (values == null) { return; }
		for (let i: number = 0; i < values.length; i++) {
			values[i](...args);
		}
	}

	public listen(name: string, fn: Function, unique?: boolean) {
		if (this._mappings.get(name) == null) {
			this._mappings.set(name, new Array<Function>());
		}
		if (unique != null && unique) {
			if (this._mappings.get(name).indexOf(fn) > -1) {
				return;
			}
		}
		this._mappings.get(name).push(fn);
	}

	public getKeys(): string[] {
		return Array.from(this._mappings.keys());
	}
}