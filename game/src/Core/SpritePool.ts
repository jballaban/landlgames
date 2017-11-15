import { Sprite } from "../UI/Sprite";

export class SpritePool {
	private sprites: Map<string, Sprite> = new Map<string, Sprite>();

	public register(id: string, sprite: Sprite): void {
		if (this.sprites.get(id) == null) {
			this.sprites.set(id, sprite);
		}
	}

	public get(id: string): Sprite {
		if (this.sprites.get(id) == null) {
			throw "Sprite " + id + " not found";
		}
		return this.sprites.get(id);
	}

	public ready(): boolean {
		var values: Sprite[] = Array.from(this.sprites.values());
		for (var i: number = 0; i < values.length; i++) {
			if (!values[i].loaded) {
				return false;
			}
		}
		return true;
	}
}