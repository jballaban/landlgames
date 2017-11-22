import { Game } from "./Game";
import { Level } from "./Level";

export class Runtime {
	private static fps: FPSMeter;
	public static game: Game;
	private static last: number;

	public static init(options: any) {
		if (options.showFPS) {
			Runtime.fps = new FPSMeter(null, {
				decimals: 0,
				graph: 1,
				left: "5px"
			});
		}
		Runtime.last = window.performance.now();
		requestAnimationFrame(Runtime.frame);
	}

	private static frame(now: number): void {
		try {
			if (Runtime.fps) {
				Runtime.fps.tickStart();
			}
			if (Runtime.game != null) {
				Runtime.game.update(Math.min(1, (now - Runtime.last) / 1000));
				Runtime.game.draw();
			}
			if (Runtime.fps) {
				Runtime.fps.tick();
			}
			requestAnimationFrame(Runtime.frame);
		} catch (e) {
			alert(e.message + "\n" + e.stack);
			throw e;
		}
	}
}