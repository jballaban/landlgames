import { ICollisionCallback } from "./Collisions";
import { PhysicalCircle } from "./PhysicalShape";
import { Manifold } from "./Manifold";
import { Body } from "./Body";
import { PhysicalPolygon } from "./PhysicalPolygon";
import { Vector2D } from "../Vector";
import { ImpulseMath } from "./ImpulseMath";

export class CollisionCirclePolygon implements ICollisionCallback {

	public static instance: CollisionCirclePolygon = new CollisionCirclePolygon();

	public handleCollision(m: Manifold, a: Body, b: Body): void {
		let A: PhysicalCircle = a.shape as PhysicalCircle;
		let B: PhysicalPolygon = b.shape as PhysicalPolygon;

		m.contactCount = 0;

		// Transform circle center to Polygon model space
		// Vec2 center = a->position;
		// center = B->u.Transpose( ) * (center - b->position);
		let p: Vector2D = a.position.clone().subtract(b.position);
		let center: Vector2D = p.multiplyMatrix(B.u.clone().transpose());

		// Find edge with minimum penetration
		// Exact concept as using support points in Polygon vs Polygon
		let separation: number = -Number.MAX_VALUE;
		let faceNormal: number = 0;
		for (let i: number = 0; i < B.vertexCount; ++i) {
			// real s = Dot( B->m_normals[i], center - B->m_vertices[i] );
			let s: number = B.normals[i].dot(center.clone().subtract(B.vertices[i]));

			if (s > A.r) {
				return;
			}

			if (s > separation) {
				separation = s;
				faceNormal = i;
			}
		}

		// Grab face's vertices
		let v1: Vector2D = B.vertices[faceNormal].clone();
		let i2: number = (faceNormal + 1) < B.vertexCount ? (faceNormal + 1) : 0;
		let v2: Vector2D = B.vertices[i2].clone();

		// Check to see if center is within polygon
		if (separation < ImpulseMath.EPSILON) {
			// m->contact_count = 1;
			// m->normal = -(B->u * B->m_normals[faceNormal]);
			// m->contacts[0] = m->normal * A->radius + a->position;
			// m->penetration = A->radius;

			m.contactCount = 1;
			m.normal = B.normals[faceNormal].clone().multiplyMatrix(B.u).negate();
			m.contacts[0].set(m.normal.x, m.normal.y).multiplyScalar(A.r).add(a.position);
			m.penetration = A.r;
			return;
		}

		// Determine which voronoi region of the edge center of circle lies within
		// real dot1 = Dot( center - v1, v2 - v1 );
		// real dot2 = Dot( center - v2, v1 - v2 );
		// m->penetration = A->radius - separation;
		let dot1: number = center.clone().subtract(v1).dot(v2.clone().subtract(v1));
		let dot2: number = center.clone().subtract(v2).dot(v1.clone().subtract(v2));
		m.penetration = A.r - separation;

		// Closest to v1
		if (dot1 <= 0.0) {
			if (center.distanceSquared(v1) > A.r * A.r) {
				return;
			}

			// m->contact_count = 1;
			// Vec2 n = v1 - center;
			// n = B->u * n;
			// n.Normalize( );
			// m->normal = n;
			// v1 = B->u * v1 + b->position;
			// m->contacts[0] = v1;

			m.contactCount = 1;
			m.normal.set(v1.x, v1.y).subtract(center).multiplyMatrix(B.u).normalize();
			m.contacts[0] = v1.clone().multiplyMatrix(B.u).add(b.position);
		} else if (dot2 <= 0.0) { // Closest to v2
			if (center.distanceSquared(v2) > A.r * A.r) {
				return;
			}

			// m->contact_count = 1;
			// Vec2 n = v2 - center;
			// v2 = B->u * v2 + b->position;
			// m->contacts[0] = v2;
			// n = B->u * n;
			// n.Normalize( );
			// m->normal = n;

			m.contactCount = 1;
			m.normal.set(v2.x, v2.y).subtract(center).multiplyMatrix(B.u).normalize();
			m.contacts[0] = v2.clone().multiplyMatrix(B.u).add(b.position);
		} else { 		// Closest to face
			let n: Vector2D = B.normals[faceNormal].clone();

			if (center.clone().subtract(v1).dot(n) > A.r) {
				return;
			}

			// n = B->u * n;
			// m->normal = -n;
			// m->contacts[0] = m->normal * A->radius + a->position;
			// m->contact_count = 1;

			m.contactCount = 1;
			m.normal = n.clone().multiplyMatrix(B.u).negate();
			m.contacts[0].set(a.position.x, a.position.y).addVectorWithScalar(m.normal, A.r);
		}
	}

}