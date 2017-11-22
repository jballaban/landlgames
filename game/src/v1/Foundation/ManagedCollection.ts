
export class ManagedCollection<T> {

	public values: T[] = new Array<T>();

	public add(obj: T): T {
		this.values.push(obj);
		return obj;
	}

}