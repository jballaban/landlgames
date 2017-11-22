export class Vector {

	public constructor(
		public x: number,
		public y: number,
		public z: number
	) { }

	public clone(): Vector {
		return new Vector(this.x, this.y, this.z);
	}

	public magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	public normalize(): Vector {
		var m: number = this.magnitude();
		if (m > 0) {
			this.multiply(1 / m);
		}
		return this;
	}

	public dot(other: Vector): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	public multiply(n: number): Vector {
		this.x = this.x * n;
		this.y = this.y * n;
		this.z = this.z * n;
		return this;
	}

	public add(other: Vector): Vector {
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
		return this;
	}

	public subtract(other: Vector): Vector {
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
		return this;
	}

}