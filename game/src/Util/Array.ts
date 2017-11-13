
export class Array {

	public static exists<T>(el: T, arr: T[]): boolean {
		return Array.indexOf(el, arr) > -1;
	}

	public static indexOf<T>(el: T, arr: T[]): number {
		for (var i: number = 0; i < arr.length; i++) {
			if (arr[i] === el) {
				return i;
			}
		}
		return -1;
	}

	public static insertSorted(property: string, obj: any, array: any[]): void {
		array.splice(Array.indexOfProperty(property, obj[property], array), 0, obj);
	}

	public static indexOfProperty(property: string, index: number, array: any[]): number {
		for (var i: number = 0; i < array.length; i++) {
			if (array[i][name] >= index) {
				return i;
			}
		}
		return array.length;
	}

	public static diff(oldregions: any[], newregions: any[], added?: any[], removed?: any[], unchanged?: any[]) {
		for (var i: number = 0; i < oldregions.length; i++) {
			if (newregions.indexOf(oldregions[i]) === -1) {
				if (removed != null) {
					removed.push(oldregions[i]);
				}
			} else {
				if (unchanged != null) {
					unchanged.push(oldregions[i]);
				}
			}
		}
		for (var i: number = 0; i < newregions.length; i++) {
			if (oldregions.indexOf(newregions[i]) === -1) {
				if (added != null) {
					added.push(newregions[i]);
				}
			} else {
				if (unchanged != null) {
					unchanged.push(newregions[i]);
				}
			}
		}
	}

}