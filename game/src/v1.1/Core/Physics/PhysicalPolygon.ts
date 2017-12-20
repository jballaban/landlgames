import { IPhysicalShape, ShapeType } from "./PhysicalShape";
import { Vector2D } from "../Vector";
import { Body } from "./Body";
import { Matrix } from "./Matrix";
import { Polygon } from "../Shape";

export class PhysicalPolygon extends Polygon implements IPhysicalShape {

	public normals: Vector2D[] = Vector2D.arrayOf(Polygon.MAX_POLY_VERTEX_COUNT);
	public body: Body;
	public type: ShapeType = ShapeType.Polygon;

	constructor(vertices?: Vector2D[]) {
		super();
		if (vertices != null) {
			this.set(vertices);
		}
	}

	public static rectangle(hw: number, hh: number): PhysicalPolygon {
		let out: PhysicalPolygon = new PhysicalPolygon();
		out.setBox(hw, hh);
		return out;
	}

	public clone(): PhysicalPolygon {
		//		PolygonShape *poly = new PolygonShape( );
		//	    poly->u = u;
		//	    for(uint32 i = 0; i < m_vertexCount; ++i)
		//	    {
		//	      poly->m_vertices[i] = m_vertices[i];
		//	      poly->m_normals[i] = m_normals[i];
		//	    }
		//	    poly->m_vertexCount = m_vertexCount;
		//	    return poly;

		let p: PhysicalPolygon = new PhysicalPolygon();
		p.u.set(this.u.m00, this.u.m01, this.u.m10, this.u.m11);
		for (let i: number = 0; i < this.vertexCount; i++) {
			p.vertices[i].set(this.vertices[i].x, this.vertices[i].y);
			p.normals[i].set(this.normals[i].x, this.normals[i].y);
		}
		p.vertexCount = this.vertexCount;

		return p;
	}

	public initialize(): void {
		this.computeMass(1.0);
	}

	public computeMass(density: number): void {
		// Calculate centroid and moment of inertia
		let c: Vector2D = new Vector2D(0.0, 0.0); // centroid
		let area: number = 0.0;
		let I: number = 0.0;
		let k_inv3: number = 1.0 / 3.0;

		for (let i: number = 0; i < this.vertexCount; ++i) {
			// Triangle vertices, third vertex implied as (0, 0)
			let p1: Vector2D = this.vertices[i];
			let p2: Vector2D = this.vertices[(i + 1) % this.vertexCount];

			let D: number = p1.cross(p2);
			let triangleArea: number = 0.5 * D;

			area += triangleArea;

			// Use area to weight the centroid average, not just vertex position
			let weight: number = triangleArea * k_inv3;
			c.addVectorWithScalar(p1, weight);
			c.addVectorWithScalar(p2, weight);

			let intx2: number = p1.x * p1.x + p2.x * p1.x + p2.x * p2.x;
			let inty2: number = p1.y * p1.y + p2.y * p1.y + p2.y * p2.y;
			I += (0.25 * k_inv3 * D) * (intx2 + inty2);
		}

		c.multiplyScalar(1.0 / area);

		// Translate vertices to centroid (make the centroid (0, 0)
		// for the polygon in model space)
		// Not really necessary, but I like doing this anyway
		for (let i: number = 0; i < this.vertexCount; ++i) {
			this.vertices[i].subtract(c);
		}

		this.body.mass = density * area;
		this.body.invMass = (this.body.mass !== 0.0) ? 1.0 / this.body.mass : 0.0;
		this.body.inertia = I * density;
		this.body.invInertia = (this.body.inertia !== 0.0) ? 1.0 / this.body.inertia : 0.0;
	}

	public setOrient(radians: number): void {
		this.u.setRotation(radians);
	}

	public setBox(hw: number, hh: number): void {
		this.vertexCount = 4;
		this.vertices[0].set(-hw, -hh);
		this.vertices[1].set(hw, -hh);
		this.vertices[2].set(hw, hh);
		this.vertices[3].set(-hw, hh);
		this.normals[0].set(0.0, -1.0);
		this.normals[1].set(1.0, 0.0);
		this.normals[2].set(0.0, 1.0);
		this.normals[3].set(-1.0, 0.0);
	}

	public set(verts: Vector2D[]): void {
		// find the right most point on the hull
		let rightMost: number = 0;
		let highestXCoord: number = verts[0].x;
		for (let i: number = 1; i < verts.length; ++i) {
			let x: number = verts[i].x;

			if (x > highestXCoord) {
				highestXCoord = x;
				rightMost = i;
			} else if (x === highestXCoord) { // if matching x then take farthest negative y
				if (verts[i].y < verts[rightMost].y) {
					rightMost = i;
				}
			}
		}

		let hull: number[] = new Array<number>(PhysicalPolygon.MAX_POLY_VERTEX_COUNT);
		let outCount: number = 0;
		let indexHull: number = rightMost;

		for (; ;) {
			hull[outCount] = indexHull;

			// search for next index that wraps around the hull
			// by computing cross products to find the most counter-clockwise
			// vertex in the set, given the previos hull index
			let nextHullIndex: number = 0;
			for (let i: number = 1; i < verts.length; ++i) {
				// skip if same coordinate as we need three unique
				// points in the set to perform a cross product
				if (nextHullIndex === indexHull) {
					nextHullIndex = i;
					continue;
				}

				// cross every set of three unique vertices
				// record each counter clockwise third vertex and add
				// to the output hull
				// see : http://www.oocities.org/pcgpe/math2d.html
				let e1: Vector2D = verts[nextHullIndex].clone().subtract(verts[hull[outCount]]);
				let e2: Vector2D = verts[i].clone().subtract(verts[hull[outCount]]);
				let c: number = e1.clone().cross(e2);
				if (c < 0.0) {
					nextHullIndex = i;
				}

				// cross product is zero then e vectors are on same line
				// therefore want to record vertex farthest along that line
				if (c === 0.0 && e2.lengthSquared() > e1.lengthSquared()) {
					nextHullIndex = i;
				}
			}

			++outCount;
			indexHull = nextHullIndex;

			// conclude algorithm upon wrap-around
			if (nextHullIndex === rightMost) {
				this.vertexCount = outCount;
				break;
			}
		}

		// copy vertices into shape's vertices
		for (let i: number = 0; i < this.vertexCount; ++i) {
			this.vertices[i].set(verts[hull[i]].x, verts[hull[i]].y);
		}

		// compute face normals
		for (let i: number = 0; i < this.vertexCount; ++i) {
			let face: Vector2D = this.vertices[(i + 1) % this.vertexCount].clone().subtract(this.vertices[i]);

			// calculate normal with 2D cross product between vector and scalar
			this.normals[i].set(face.y, -face.x);
			this.normals[i].normalize();
		}
	}

	public getSupport(dir: Vector2D): Vector2D {
		let bestProjection: number = -Number.MAX_VALUE;
		let bestVertex: Vector2D = null;

		for (let i: number = 0; i < this.vertexCount; ++i) {
			let v: Vector2D = this.vertices[i];
			let projection: number = v.dot(dir);

			if (projection > bestProjection) {
				bestVertex = v;
				bestProjection = projection;
			}
		}

		return bestVertex;
	}

}