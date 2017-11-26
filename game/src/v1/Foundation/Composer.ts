import { Vector3D } from "../Core/Vector";

export interface IAttributeComposer {
	(obj1: any, obj2: any): any;
}

export class Composer {
	public static Vector3DAdd(obj1: Vector3D, obj2: Vector3D): Vector3D {
		if (obj2 == null) {
			return obj1;
		}
		if (obj1 == null) {
			return obj2;
		}
		return obj1.clone().add(obj2);
	}

	public static BooleanOr(obj1: boolean, obj2: boolean): boolean {
		if (obj2 == null) {
			return obj1;
		}
		if (obj1 == null) {
			return obj2;
		}
		return obj1 || obj2;
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