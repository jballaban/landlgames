import { Component } from "../Core/Component";
import { Vector3D } from "../Core/Vector";

export class TransformComponent extends Component {
	public origin: Vector3D = new Vector3D(0, 0, 0);
	public scale: Vector3D = new Vector3D(1, 1, 1);
	public rotate: Vector3D = new Vector3D(0, 0, 0);

	public getEffectiveRotate(root: Vector3D): Vector3D {
		let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		if (ancestor == null) {
			if (root == null) {
				return this.rotate.clone();
			}
			return this.rotate.clone().add(root);
		}
		return this.rotate.clone().add(ancestor.getEffectiveRotate(root));
	}

	public getEffectiveScale(root: Vector3D): Vector3D {
		let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		if (ancestor == null) {
			if (root == null) {
				return this.scale.clone();
			}
			return this.scale.clone().cross(root);
		}
		return this.scale.clone().cross(ancestor.getEffectiveScale(root));
	}

	public getEffectiveOrigin(rootOrigin: Vector3D, rootScale: Vector3D, rootRotate: Vector3D): Vector3D {
		/* let origin: Vector3D = this.getAttribute<Vector3D>("origin").clone()
		origin.multiply(this.parent == null ? cameraScale : this.parent.getEffectiveScale(cameraScale));
		let rads: number = (this.parent == null ? cameraRotateZ : this.parent.getEffectiveRotateZ(cameraRotateZ)) * Math.PI / 180;
		if (this.parent == null) {
			origin.subtract(cameraOrigin.clone().multiply(cameraScale));
		}
		let x: number = origin.x * Math.cos(rads) - origin.y * Math.sin(rads);
		let y: number = origin.x * Math.sin(rads) + origin.y * Math.cos(rads);
		origin.x = x;
		origin.y = y;
		return this.parent == null ? origin.add(cameraOrigin) : Composer.Vector3DAdd(origin, this.parent.getEffectiveOrigin(cameraOrigin, cameraScale, cameraRotateZ)); */
		let origin = this.origin.clone();
		let ancestor = this.entity.getAncestorComponent<TransformComponent>(TransformComponent);
		if (ancestor == null && rootScale != null) {
			origin.cross(rootScale);
		}
		else if (ancestor != null) {
			origin.cross(ancestor.getEffectiveScale(rootScale));
		}
		let rads: number = 0;
		if (ancestor == null && rootRotate != null) {
			rads = rootRotate.z * Math.PI / 180;
		}
		else if (ancestor != null) {
			rads = ancestor.getEffectiveRotate(rootRotate).z * Math.PI / 180;
		}
		if (ancestor == null && rootOrigin != null) {
			origin.add(rootOrigin);
		}
		let x: number = origin.x * Math.cos(rads) - origin.y * Math.sin(rads);
		let y: number = origin.x * Math.sin(rads) + origin.y * Math.cos(rads);
		origin.x = x;
		origin.y = y;
		if (ancestor != null) {
			return origin.add(ancestor.getEffectiveOrigin(rootOrigin, rootScale, rootRotate));
		}
		if (rootOrigin != null) {
			return origin.subtract(rootOrigin);
		}
		return origin;
	}
}