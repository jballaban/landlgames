import { Sprite } from "../UI/Sprite";

export class SpritePool {
	public sprites: Map<number, Sprite> = new Map<number, Sprite>();

	public register(id: number, sprite: Sprite): void {
		this.sprites.set(id, sprite);
	}
}