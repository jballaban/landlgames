import { Game } from "./Game";
import { Time } from "./Time";
import { MouseHandler } from "./MouseHandler";

export interface IRuntimeOptions {
	showFPS: boolean;
	showUpdatesPerFrame: boolean;
	showDrawTime: boolean;
}

export class Runtime {
	private static fps: FPSMeter;
	private static updateTime: FPSMeter;
	private static drawTime: FPSMeter;
	public static game: Game;
	private static lag: number = 0;
	private static last: number;

	public static init(options: IRuntimeOptions): void {
		if (options.showFPS) {
			Runtime.fps = new FPSMeter(null, {
				decimals: 0,
				graph: 1,
				left: "5px"
			});
		}
		if (options.showUpdatesPerFrame) {
			Runtime.updateTime = new FPSMeter(null, {
				decimals: 0,
				graph: 1,
				left: "125px"
			});
		} if (options.showDrawTime) {
			Runtime.drawTime = new FPSMeter(null, {
				decimals: 0,
				graph: 1,
				left: "245px",
				show: "ms",
				smoothing: 0.8
			});
		}
		MouseHandler.init();
		requestAnimationFrame(Runtime.frame);
	}

	private static frame(now: number): void {
		try {
			if (Runtime.fps != null) { Runtime.fps.tickStart(); }
			if (Runtime.last == null) { Runtime.last = now; }
			if (Time.epoch == null) { Time.epoch = now; }
			let elapsed: number = (now - Runtime.last) / 1000;
			Time.realTime += elapsed;
			Runtime.lag += elapsed;
			Time.frameCount++;
			Runtime.game.changeScene();
			// proceesInput
			while (Time.delta > 0 && Runtime.lag >= Time.step) {
				Time.gameTime += Time.delta;
				if (Runtime.updateTime != null) { Runtime.updateTime.tickStart(); }
				Runtime.game.fixedUpdate();
				if (Runtime.updateTime != null) { Runtime.updateTime.tick(); }
				Runtime.lag -= Time.step;
			}
			Runtime.game.update();
			Runtime.game.lateUpdate();
			if (Runtime.drawTime != null) { Runtime.drawTime.tickStart(); }
			Runtime.game.render();
			if (Runtime.drawTime != null) { Runtime.drawTime.tick(); }
			Runtime.last = now;
			if (Runtime.fps != null) { Runtime.fps.tick(); }
			requestAnimationFrame(Runtime.frame);
		} catch (e) {
			alert(e.message + "\n" + e.stack);
			throw e;
		}
	}
}