export class Time {
	private static _timescale: number = 1; // scale of game time
	public static get scale(): number { return Time._timescale; }
	public static set scale(value: number) { Time._timescale = value; Time.updateDelta(); }

	private static _step: number = 1 / 60; // the size of an update
	public static get step(): number { return Time._step; }
	public static set step(value: number) { Time._step = value; Time.updateDelta(); }

	private static _delta: number;
	public static get delta(): number {
		if (Time._delta == null) { Time.updateDelta(); }
		return Time._delta;
	} // time since last update

	private static updateDelta(): void {
		Time._delta = Time.step * Time.scale;
	}

	public static frameCount: number = 0; // current frame count since the beginning of time (readonly)
	public static gameTime: number = 0; // number of game seconds since started (readonly)
	public static realTime: number = 0; // the number of real world seconds since started (readonly)
	public static epoch: number = 0; // real world start time of the game (readonly)
}