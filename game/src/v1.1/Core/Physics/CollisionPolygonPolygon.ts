import { PhysicalPolygon } from "./PhysicalPolygon";
import { Manifold } from "./Manifold";
import { ICollisionCallback } from "./Collisions";
import { Body } from "./Body";
import { ImpulseMath } from "./ImpulseMath";
import { Vector2D } from "../Vector";
import { Matrix } from "./Matrix";

export class CollisionPolygonPolygon implements ICollisionCallback {

	public static instance: CollisionPolygonPolygon = new CollisionPolygonPolygon();

	public handleCollision(m: Manifold, a: Body, b: Body): void {
		let A: PhysicalPolygon = a.shape as PhysicalPolygon;
		let B: PhysicalPolygon = b.shape as PhysicalPolygon;
		m.contactCount = 0;

		// Check for a separating axis with A's face planes
		let faceA: number[] = [0];
		let penetrationA: number = this.findAxisLeastPenetration(faceA, A, B);
		if (penetrationA >= 0.0) {
			return;
		}

		// Check for a separating axis with B's face planes
		let faceB: number[] = [0];
		let penetrationB: number = this.findAxisLeastPenetration(faceB, B, A);
		if (penetrationB >= 0.0) {
			return;
		}

		let referenceIndex: number;
		let flip: boolean; // Always point from a to b

		let RefPoly: PhysicalPolygon; // Reference
		let IncPoly: PhysicalPolygon; // Incident

		// Determine which shape contains reference face
		if (ImpulseMath.gt(penetrationA, penetrationB)) {
			RefPoly = A;
			IncPoly = B;
			referenceIndex = faceA[0];
			flip = false;
		} else {
			RefPoly = B;
			IncPoly = A;
			referenceIndex = faceB[0];
			flip = true;
		}

		// World space incident face
		let incidentFace: Vector2D[] = Vector2D.arrayOf(2);

		this.findIncidentFace(incidentFace, RefPoly, IncPoly, referenceIndex);

		// y
		// ^ .n ^
		// +---c ------posPlane--
		// x < | i |\
		// +---+ c-----negPlane--
		// \ v
		// r
		//
		// r : reference face
		// i : incident poly
		// c : clipped point
		// n : incident normal

		// Setup reference face vertices
		let v1: Vector2D = RefPoly.vertices[referenceIndex];
		referenceIndex = (referenceIndex + 1) === RefPoly.vertexCount ? 0 : (referenceIndex + 1);
		let v2: Vector2D = RefPoly.vertices[referenceIndex];

		// Transform vertices to world space
		// v1 = RefPoly->u * v1 + RefPoly->body->position;
		// v2 = RefPoly->u * v2 + RefPoly->body->position;
		v1.multiplyMatrix(RefPoly.u).add(RefPoly.body.position);
		v2.multiplyMatrix(RefPoly.u).add(RefPoly.body.position);

		// Calculate reference face side normal in world space
		// Vec2 sidePlaneNormal = (v2 - v1);
		// sidePlaneNormal.Normalize( );
		let sidePlaneNormal: Vector2D = v2.clone().subtract(v1).normalize();

		// Orthogonalize
		// Vec2 refFaceNormal( sidePlaneNormal.y, -sidePlaneNormal.x );
		let refFaceNormal: Vector2D = new Vector2D(sidePlaneNormal.y, -sidePlaneNormal.x);

		// ax + by = c
		// c is distance from origin
		// real refC = Dot( refFaceNormal, v1 );
		// real negSide = -Dot( sidePlaneNormal, v1 );
		// real posSide = Dot( sidePlaneNormal, v2 );
		let refC: number = refFaceNormal.dot(v1);
		let negSide: number = -sidePlaneNormal.dot(v1);
		let posSide: number = sidePlaneNormal.dot(v2);

		// Clip incident face to reference face side planes
		// if(Clip( -sidePlaneNormal, negSide, incidentFace ) < 2)
		if (this.clip(sidePlaneNormal.clone().negate(), negSide, incidentFace) < 2) {
			return; // Due to floating point error, possible to not have required
			// points
		}

		// if(Clip( sidePlaneNormal, posSide, incidentFace ) < 2)
		if (this.clip(sidePlaneNormal, posSide, incidentFace) < 2) {
			return; // Due to floating point error, possible to not have required
			// points
		}

		// Flip
		m.normal.set(refFaceNormal.x, refFaceNormal.y);
		if (flip) {
			m.normal.negate();
		}

		// Keep points behind reference face
		let cp: number = 0; // clipped points behind reference face
		let separation: number = refFaceNormal.dot(incidentFace[0]) - refC;
		if (separation <= 0.0) {
			m.contacts[cp].set(incidentFace[0].x, incidentFace[0].y);
			m.penetration = -separation;
			++cp;
		} else {
			m.penetration = 0;
		}

		separation = refFaceNormal.dot(incidentFace[1]) - refC;

		if (separation <= 0.0) {
			m.contacts[cp].set(incidentFace[1].x, incidentFace[1].y);

			m.penetration += -separation;
			++cp;

			// Average penetration
			m.penetration /= cp;
		}

		m.contactCount = cp;
	}

	public findAxisLeastPenetration(faceIndex: number[], A: PhysicalPolygon, B: PhysicalPolygon): number {
		let bestDistance: number = -Number.MAX_VALUE;
		let bestIndex: number = 0;

		for (let i: number = 0; i < A.vertexCount; ++i) {
			// Retrieve a face normal from A
			// Vec2 n = A->m_normals[i];
			// Vec2 nw = A->u * n;
			let nw: Vector2D = A.normals[i].clone().multiplyMatrix(A.u);

			// Transform face normal into B's model space
			// Mat2 buT = B->u.Transpose( );
			// n = buT * nw;
			let buT: Matrix = B.u.clone().transpose();
			let n: Vector2D = nw.clone().multiplyMatrix(buT);

			// Retrieve support point from B along -n
			// Vec2 s = B->GetSupport( -n );
			let s: Vector2D = B.getSupport(n.clone().negate());

			// Retrieve vertex on face from A, transform into
			// B's model space
			// Vec2 v = A->m_vertices[i];
			// v = A->u * v + A->body->position;
			// v -= B->body->position;
			// v = buT * v;
			let v: Vector2D = A.vertices[i].clone()
				.multiplyMatrix(A.u)
				.add(A.body.position)
				.subtract(B.body.position)
				.multiplyMatrix(buT);

			// Compute penetration distance (in B's model space)
			// real d = Dot( n, s - v );
			let d: number = n.dot(s.clone().subtract(v));

			// Store greatest distance
			if (d > bestDistance) {
				bestDistance = d;
				bestIndex = i;
			}
		}

		faceIndex[0] = bestIndex;
		return bestDistance;
	}

	public findIncidentFace(
		v: Vector2D[],
		RefPoly: PhysicalPolygon,
		IncPoly: PhysicalPolygon,
		referenceIndex: number,
	): void {
		let referenceNormal: Vector2D = RefPoly.normals[referenceIndex];

		// Calculate normal in incident's frame of reference
		// referenceNormal = RefPoly->u * referenceNormal; // To world space
		// referenceNormal = IncPoly->u.Transpose( ) * referenceNormal; // To
		// incident's model space
		referenceNormal.multiplyMatrix(RefPoly.u).multiplyMatrix(IncPoly.u.clone().transpose());
		// model
		// space

		// Find most anti-normal face on incident polygon
		let incidentFace: number = 0;
		let minDot: number = Number.MAX_VALUE;
		for (let i: number = 0; i < IncPoly.vertexCount; ++i) {
			// real dot = Dot( referenceNormal, IncPoly->m_normals[i] );
			let dot: number = referenceNormal.dot(IncPoly.normals[i]);

			if (dot < minDot) {
				minDot = dot;
				incidentFace = i;
			}
		}

		// Assign face vertices for incidentFace
		// v[0] = IncPoly->u * IncPoly->m_vertices[incidentFace] +
		// IncPoly->body->position;
		// incidentFace = incidentFace + 1 >= (int32)IncPoly->m_vertexCount ? 0 :incidentFace + 1;
		// v[1] = IncPoly->u * IncPoly->m_vertices[incidentFace] +
		// IncPoly->body->position;
		v[0] = IncPoly.vertices[incidentFace].clone().multiplyMatrix(IncPoly.u).add(IncPoly.body.position);
		incidentFace = (incidentFace + 1) >= IncPoly.vertexCount ? 0 : (incidentFace + 1);
		v[1] = IncPoly.vertices[incidentFace].clone().multiplyMatrix(IncPoly.u).add(IncPoly.body.position);
	}

	public clip(n: Vector2D, c: number, face: Vector2D[]): number {
		let sp: number = 0;
		let out: Vector2D[] = [face[0].clone(), face[1].clone()];

		// Retrieve distances from each endpoint to the line
		// d = ax + by - c
		// real d1 = Dot( n, face[0] ) - c;
		// real d2 = Dot( n, face[1] ) - c;
		let d1: number = n.dot(face[0]) - c;
		let d2: number = n.dot(face[1]) - c;

		// If negative (behind plane) clip
		// if(d1 <= 0.0f) out[sp++] = face[0];
		// if(d2 <= 0.0f) out[sp++] = face[1];
		if (d1 <= 0.0) { out[sp++].set(face[0].x, face[0].y); }
		if (d2 <= 0.0) { out[sp++].set(face[1].x, face[1].y); }

		// If the points are on different sides of the plane
		if (d1 * d2 < 0.0) // less than to ignore -0.0f
		{
			// Push intersection point
			// real alpha = d1 / (d1 - d2);
			// out[sp] = face[0] + alpha * (face[1] - face[0]);
			// ++sp;

			let alpha: number = d1 / (d1 - d2);
			out[sp++].set(face[1].x, face[1].y).subtract(face[0]).multiplyScalar(alpha).add(face[0]);
		}

		// Assign our new converted values
		face[0] = out[0];
		face[1] = out[1];

		// assert( sp != 3 );

		return sp;
	}

}
