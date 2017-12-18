
export class EnhancedArray<T> extends Array<T> {
	public size: number = 0;

	public clear(): void {
		for (let i: number = 0; i < this.length; i++) {
			this[i] = null;
		}
		this.size = 0;
	}

	public add(value: T): T {
		this[this.size++] = value;
		return value;
	}
}