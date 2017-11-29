export class EventHandler {
	private _mappings: Map<string, Function[]> = new Map<string, Function[]>();
	public fire(name: string, data: object): void {
		var values: Function[] = this._mappings.get(name);
		if (values == null) { return; }
		for (let i: number = 0; i < values.length; i++) {
			values[i](data);
		}
	}

	public listen(name: string, fn: Function) {
		if (this._mappings.get(name) == null) {
			this._mappings.set(name, new Array<Function>());
		}
		if (this._mappings.get(name).indexOf(fn) === -1) {
			this._mappings.get(name).push(fn);
		}
	}
}