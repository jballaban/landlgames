import { Vector2D } from "./Vector";

export class ImpulseMath {

	public static PI: number;
	public static EPSILON: number;
	public static EPSILON_SQ: number;
	public static BIAS_RELATIVE: number;
	public static BIAS_ABSOLUTE: number;
	public static DT: number;
	public static GRAVITY: Vector2D;
	public static RESTING: number;
	public static PENETRATION_ALLOWANCE: number;
	public static PENETRATION_CORRETION: number;

	public static initialize(): void {
		ImpulseMath.PI = Math.PI;
		ImpulseMath.EPSILON = 0.0001;
		ImpulseMath.EPSILON_SQ = ImpulseMath.EPSILON * ImpulseMath.EPSILON;
		ImpulseMath.BIAS_RELATIVE = 0.95;
		ImpulseMath.BIAS_ABSOLUTE = 0.01;
		ImpulseMath.DT = 1.0 / 60.0;
		ImpulseMath.GRAVITY = new Vector2D(0.0, 50.0);
		ImpulseMath.RESTING = ImpulseMath.GRAVITY.multiplyScalar(ImpulseMath.DT).lengthSquared() + ImpulseMath.EPSILON;
		ImpulseMath.PENETRATION_ALLOWANCE = 0.05;
		ImpulseMath.PENETRATION_CORRETION = 0.4;
	}

	public static equal(a: number, b: number): boolean {
		return Math.abs(a - b) <= ImpulseMath.EPSILON;
	}

	public static clamp(min: number, max: number, a: number): number {
		return (a < min ? min : (a > max ? max : a));
	}

	public static round(a: number): number {
		return Math.round(a);
	}

	public static random(min: number, max: number, whole: boolean): number {
		if (whole) {
			return Math.floor((max - min + 1) * Math.random() + min);
		}
		return ((max - min) * Math.random() + min);
	}

	public static gt(a: number, b: number): boolean {
		return a >= b * ImpulseMath.BIAS_RELATIVE + a * ImpulseMath.BIAS_ABSOLUTE;
	}

}