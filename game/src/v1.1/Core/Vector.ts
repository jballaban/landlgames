
export class Vector3D {

	public constructor(
		public x: number,
		public y: number,
		public z: number
	) { }

	public static Zero(): Vector3D {
		return new Vector3D(0, 0, 0);
	}

	public clone(): Vector3D {
		return new Vector3D(this.x, this.y, this.z);
	}

	public magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	public normalize(): Vector3D {
		var m: number = this.magnitude();
		if (m > 0) {
			this.multiply(1 / m);
		}
		return this;
	}

	public dot(other: Vector3D): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	public cross(other: Vector3D): Vector3D {
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;
		return this;
	}

	public multiply(n: number): Vector3D {
		this.x = this.x * n;
		this.y = this.y * n;
		this.z = this.z * n;
		return this;
	}

	public add(other: Vector3D): Vector3D {
		return this.addScalars(other.x, other.y, other.z);
	}

	public addScalars(x: number, y: number, z: number): Vector3D {
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}

	public subtract(other: Vector3D): Vector3D {
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
		return this;
	}

	public toString(): string {
		return "[" + this.x + ", " + this.y + ", " + this.z + "]";
	}

}