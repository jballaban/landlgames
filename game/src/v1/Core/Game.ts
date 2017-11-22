import { Level } from "./Level";

export class Game {
	public level: Level;
	public nextLevel: Level;

	public update(seconds: number): void {
		if (this.nextLevel != null) {
			if (this.level != null) {
				this.level.destroy();
			}
			this.level = this.nextLevel;
			this.nextLevel = null;
		}
		if (this.level != null) {
			this.level.update(seconds);
		}
	}

	public draw(): void {
		if (this.level != null) {
			this.level.draw();
		}
	}
}