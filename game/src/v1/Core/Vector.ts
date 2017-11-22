
export class Vector3D {

	public constructor(
		public x: number,
		public y: number,
		public z: number
	) { }

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

	public multiply(n: number): Vector3D {
		this.x = this.x * n;
		this.y = this.y * n;
		this.z = this.z * n;
		return this;
	}

	public add(other: Vector3D): Vector3D {
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
		return this;
	}

	public subtract(other: Vector3D): Vector3D {
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
		return this;
	}

}


export class Vector2D {

	public constructor(
		public x: number,
		public y: number
	) { }

	public clone(): Vector2D {
		return new Vector2D(this.x, this.y);
	}

	public magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	public normalize(): Vector2D {
		var m: number = this.magnitude();
		if (m > 0) {
			this.multiply(1 / m);
		}
		return this;
	}

	public dot(other: Vector2D): number {
		return this.x * other.x + this.y * other.y;
	}

	public multiply(n: number): Vector2D {
		this.x = this.x * n;
		this.y = this.y * n;
		return this;
	}

	public add(other: Vector2D): Vector2D {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	public subtract(other: Vector2D): Vector2D {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	public toString(): string {
		return "[" + this.x + ", " + this.y + "]";
	}

}