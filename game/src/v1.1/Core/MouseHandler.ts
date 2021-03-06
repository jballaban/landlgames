import { Logger } from "../Utils/Logger";

export enum CursorState {
	added,
	moved,
	remove,
	unchanged
}

export enum ButtonState {
	pressed,
	pressing,
	released,
	inactive
}

export class Button {
	public data: any;

	constructor(public x: number, public y: number, public state: ButtonState) { }
}

export class Cursor {

	public data: any;

	public constructor(
		public id: number,
		public x: number,
		public y: number,
		public diffX: number,
		public diffY: number,
		public wheelY: number,
		public state: CursorState) { }

	public static fromTouch(e: Touch): Cursor {
		return new Cursor(e.identifier, e.clientX, e.clientY, 0, 0, 0, CursorState.added);
	}
}

export class MouseHandler {
	private static locked: boolean = false;
	private static _cursors: Map<number, Cursor> = new Map<number, Cursor>();
	private static mouseX: number = 0;
	private static mouseY: number = 0;
	public static cursors: Map<number, Cursor> = new Map<number, Cursor>();
	public static _leftButton: Button = new Button(0, 0, ButtonState.inactive);
	public static leftButton: Button = new Button(0, 0, ButtonState.inactive);
	public static MOUSECURSOR: number = 0;

	public static init(): void {
		document.addEventListener("mousedown", MouseHandler.onMouseDown);
		document.addEventListener("mouseup", MouseHandler.onMouseUp);
		document.addEventListener("mousemove", MouseHandler.onMouseMove);
		document.addEventListener("touchstart", MouseHandler.onTouchStart);
		document.addEventListener("touchend", MouseHandler.onTouchEnd);
		document.addEventListener("touchcancel", MouseHandler.onTouchEnd);
		document.addEventListener("touchmove", MouseHandler.onTouchMove);
		document.addEventListener("pointerlockchange", MouseHandler.lockChanged);
		document.addEventListener("wheel", MouseHandler.onWheel);
	}

	public static reset(): void {
		this._cursors = new Map<number, Cursor>();
		this.cursors = new Map<number, Cursor>();
		MouseHandler.lockChanged();
	}

	public static inc(id: number, diffx: number, diffy: number): void {
		var cursor: Cursor = MouseHandler._cursors.get(id);
		if (cursor.state === CursorState.unchanged) {
			cursor.state = CursorState.moved;
		}
		cursor.x += diffx;
		cursor.y += diffy;
		cursor.diffX += diffx;
		cursor.diffY += diffy;
	}

	public static update(): void {
		// mousebutton
		if (MouseHandler._leftButton.state === ButtonState.pressed) {
			switch (MouseHandler.leftButton.state) {
				case ButtonState.pressed:
					MouseHandler.leftButton.state = ButtonState.pressing;
					break;
				case ButtonState.pressing:
					break;
				default:
					MouseHandler.leftButton.state = ButtonState.pressed;
			}
		} else {
			MouseHandler.leftButton.state = MouseHandler._leftButton.state;
		}

		MouseHandler.leftButton.x = MouseHandler._leftButton.x;
		MouseHandler.leftButton.y = MouseHandler._leftButton.y;
		// sync _cursors to cursors
		var keys: number[] = Array.from(MouseHandler._cursors.keys());
		for (var i: number = 0; i < keys.length; i++) {
			var cursor: Cursor = MouseHandler._cursors.get(keys[i]);
			switch (cursor.state) {
				case CursorState.added:
					MouseHandler.cursors.set(keys[i],
						new Cursor(
							keys[i],
							cursor.x,
							cursor.y,
							0,
							0,
							0,
							CursorState.added
						)
					);
					break;
				case CursorState.moved:
					let realCursor: Cursor = MouseHandler.cursors.get(keys[i]);
					realCursor.x = cursor.x;
					realCursor.y = cursor.y;
					realCursor.diffX = cursor.diffX;
					realCursor.diffY = cursor.diffY;
					cursor.diffX = 0;
					cursor.diffY = 0;
					realCursor.wheelY = cursor.wheelY;
					cursor.wheelY = 0;
					realCursor.state = CursorState.moved;
					break;
				case CursorState.remove:
					if (MouseHandler.cursors.get(keys[i]).state === CursorState.remove) {
						MouseHandler.cursors.delete(keys[i]);
					} else {
						MouseHandler.cursors.get(keys[i]).state = CursorState.remove;
					}
					break;
			}
			cursor.state = CursorState.unchanged;
		}
	}

	public static cleanup(): void {
		var keys: number[] = Array.from(MouseHandler.cursors.keys());
		for (var i: number = 0; i < keys.length; i++) {
			var cursor: Cursor = MouseHandler.cursors.get(keys[i]);
			if (cursor.state === CursorState.remove) {
				MouseHandler._cursors.delete(keys[i]);
				MouseHandler.cursors.delete(keys[i]);
			} else {
				cursor.state = CursorState.unchanged;
			}
		}
	}

	public static onWheel(e: WheelEvent): void {
		e.preventDefault();
		if (MouseHandler.locked) {
			let cursor: Cursor = MouseHandler._cursors.get(0);
			if (cursor.state === CursorState.unchanged) {
				cursor.state = CursorState.moved;
			}
			cursor.wheelY += e.wheelDeltaY;
		}
	}

	public static onTouchStart(e: TouchEvent): void {
		e.preventDefault();
		for (var i: number = 0; i < e.changedTouches.length; i++) {
			MouseHandler._cursors.set(e.changedTouches[i].identifier, Cursor.fromTouch(e.changedTouches[i]));
		}
	}

	public static onTouchEnd(e: TouchEvent): void {
		e.preventDefault();
		for (var i: number = 0; i < e.changedTouches.length; i++) {
			// check if we've acked this event, if not we can just kill it before anyone notices
			if (MouseHandler.cursors.get(e.changedTouches[i].identifier) == null) {
				MouseHandler._cursors.delete(e.changedTouches[i].identifier);
			} else {
				MouseHandler._cursors.get(e.changedTouches[i].identifier).state = CursorState.remove;
			}
		}
	}

	public static onTouchMove(e: TouchEvent): void {
		e.preventDefault();
		for (var i: number = 0; i < e.changedTouches.length; i++) {
			var cursor: Cursor = MouseHandler._cursors.get(e.changedTouches[i].identifier);
			if (cursor.state === CursorState.unchanged) {
				cursor.state = CursorState.moved;
			}
			cursor.diffX += e.changedTouches[i].clientX - cursor.x;
			cursor.diffY += e.changedTouches[i].clientY - cursor.y;
			cursor.x = e.changedTouches[i].clientX;
			cursor.y = e.changedTouches[i].clientY;
		}
	}

	public static onMouseMove(e: MouseEvent): void {
		e.preventDefault();
		if (MouseHandler.locked) {
			if (Math.abs(e.movementX) > 100 || Math.abs(e.movementY) > 100) {
				return; // todo there is a bug in chrome that is causing weird large values to randomly get sent, hack fix
			}
			MouseHandler.inc(MouseHandler.MOUSECURSOR, e.movementX, e.movementY);
		} else {
			MouseHandler.mouseX = e.clientX;
			MouseHandler.mouseY = e.clientY;
		}
	}

	public static onMouseUp(e: MouseEvent): void {
		e.preventDefault();
		if (MouseHandler.locked) {
			MouseHandler._leftButton.x = e.clientX;
			MouseHandler._leftButton.y = e.clientY;
			MouseHandler._leftButton.state = ButtonState.released;
		}
	}

	public static onMouseDown(e: MouseEvent): void {
		e.preventDefault();
		if (!MouseHandler.locked) {
			document.body.requestPointerLock();
		} else {
			MouseHandler._leftButton.state = ButtonState.pressed;
		}
	}

	public static lockChanged(): void {
		if (document.pointerLockElement != null) {
			MouseHandler._cursors.set(0, new Cursor(MouseHandler.MOUSECURSOR, MouseHandler.mouseX, MouseHandler.mouseY, 0, 0, 0, CursorState.added));
			MouseHandler.locked = true;
			MouseHandler._leftButton.state = ButtonState.pressed;
		} else if (MouseHandler.locked) {
			MouseHandler.locked = false;
			MouseHandler._cursors.get(0).state = CursorState.remove;
			MouseHandler._leftButton.state = ButtonState.released;
		}
	}

}