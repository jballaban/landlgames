import { Logger } from "../Utils/Logger";

export class State {
	public down: Set<string> = new Set<string>();
	public copyFrom(state: State): void {
		this.down = state.down;
	}
}

export class KeyboardHandler {
	public static state: State = new State();
	private static _state: State = new State();
	public static init(): void {
		document.addEventListener("keydown", KeyboardHandler.onKeyDown);
		document.addEventListener("keyup", KeyboardHandler.onKeyUp);
	}

	public static onKeyDown(e: KeyboardEvent): void {
		KeyboardHandler._state.down.add(e.key);
	}

	public static onKeyUp(e): void {
		KeyboardHandler._state.down.delete(e.key);
	}

	public static update(): void {
		KeyboardHandler.state.copyFrom(KeyboardHandler._state);
	}
}