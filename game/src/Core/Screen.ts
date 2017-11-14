// tslint:disable:no-bitwise
import { Rectangle } from "../Shape/Rectangle";
import { Camera } from "../Core/Camera";
import { Logger } from "../Util/Logger";
import { RegionContainer } from "../Core/Region";
import { Element } from "../Core/Element";
import { Mouse } from "../IO/Mouse";
import { Array as ArrayUtil } from "../Util/Array";
import { Collision } from "../Util/Collision";
import { ContextLayer } from "../Core/ContextLayer";
import { Runtime } from "../Core/Runtime";
import { Color } from "../Util/Color";
import { ElementContainer, ElementRegion } from "../Core/ElementContainer";
import { EventHandler } from "../Core/EventHandler";
import { Viewport } from "../Core/Viewport";
import { MouseHandler } from "../IO/MouseHandler";
import { ElementType } from "./ElementType";
import { Action } from "../Util/Action";

export abstract class Screen {

	public container: ElementContainer;
	public actions: Action[] = new Array<Action>();
	public camera: Camera;
	protected viewport: Viewport;
	protected layer: ContextLayer;
	public visibleRegionCache: ElementRegion[];
	public static debug_showRedraws = false;
	public backgroundColor: string = "rgb(255,255,255)";

	constructor(regionsize: number, area: Rectangle) {
		this.visibleRegionCache = new Array<ElementRegion>();
		this.viewport = new Viewport();
		this.layer = new ContextLayer(this.viewport, 1);
		this.camera = new Camera(this.viewport);
		this.container = new ElementContainer(regionsize, regionsize, area);
	}

	public activate(): void {
		this.viewport.activate();
		this.layer.activate();
	}

	public deactivate(): void {
		this.layer.deactivate();
	}

	public preUpdate(): void {
		this.viewport.preUpdate();
		this.camera.preUpdate();
		this.layer.preUpdate();
	}

	public update(dt: number): void {
		for (var i: number = 0; i < this.actions.length; i++) {
			this.actions[i].update(dt);
			if (this.actions[i].completed()) {
				this.actions[i].what();
				this.actions.splice(i--, 1);
			}
		}
		for (var i: number = 0; i < this.container.elements.length; i++) {
			this.updateElement(this.container.elements[i], dt);
		}
	}

	public updateElement(element: Element, dt: number): void {
		element.update(dt);
	}

	public postUpdate(): void {
		for (var i: number = 0; i < this.container.elements.length; i++) {
			this.container.elements[i].postUpdate();
		}
		this.checkCollisions();
	}

	public preRender(): void {
		if (this.camera.area.changed()) {
			this.visibleRegionCache = this.container.getRegions("render", this.camera.area);
			for (var i: number = 0; i < this.visibleRegionCache.length; i++) {
				this.visibleRegionCache[i].changed = true;
			}
		}
	}

	public postRender(): void {
		this.viewport.postRender();
		this.camera.postRender();
		for (var i: number = 0; i < this.container.elements.length; i++) {
			this.container.elements[i].postRender();
		}
	}

	public checkCollisions(): void {
		var regions: ElementRegion[] = this.container.getRegions("collision", this.container.area);
		var checks: Map<Element, Map<Element, boolean>> = new Map<Element, Map<Element, boolean>>();
		for (var i: number = 0; i < regions.length; i++) {
			if (!regions[i].changed) {
				continue;
			}
			for (var j: number = 0; j < regions[i].elements.length - 1; j++) {
				var el: Element = regions[i].elements[j];
				if (checks.get(el) == null) {
					checks.set(el, new Map<Element, boolean>());
				}
				for (var k: number = j + 1; k < regions[i].elements.length; k++) {
					var other: Element = regions[i].elements[k];
					if (checks.get(other) == null) {
						checks.set(other, new Map<Element, boolean>());
					}
					var collides: boolean = checks.get(el).get(other);
					if (collides == null) {
						if ((el.collisionFilter & other.type) === 0 && (other.collisionFilter & el.type) === 0) {
							collides = false;
						}
					}
					if (collides == null) {
						collides = Collision.intersects(el.collisionArea, other.collisionArea);
						checks.get(el).set(other, collides && (el.collisionFilter & other.type) > 0);
						checks.get(other).set(el, collides && (other.collisionFilter & el.type) > 0);
					}
					if (!collides) {
						if (el.collisions.indexOf(other) > -1) {
							el.collisions.splice(el.collisions.indexOf(other), 1);
							el.onCollide(other, false);
						}
						if (other.collisions.indexOf(el) > -1) {
							other.collisions.splice(other.collisions.indexOf(el), 1);
							other.onCollide(el, false);
						}
					} else {
						if (el.collisions.indexOf(other) === -1 && (el.collisionFilter & other.type) > 0) {
							el.collisions.push(other);
							el.onCollide(other, true);
						}
						if (other.collisions.indexOf(el) === -1 && (other.collisionFilter & el.type) > 0) {
							other.collisions.push(el);
							other.onCollide(el, true);
						}
					}
				}
			}
			regions[i].changed = false;
		}
	}

	public render(): void {
		for (var region of this.visibleRegionCache) {
			if (!region.changed) { continue; }
			this.layer.ctx.fillStyle = Screen.debug_showRedraws ? Color.getRandomColor() : this.backgroundColor;
			this.layer.ctx.fillRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			this.layer.ctx.save();
			// clip a rectangular area
			this.layer.ctx.beginPath();
			this.layer.ctx.rect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			this.layer.ctx.clip();
			for (var i: number = 0; i < region.elements.length; i++) {
				region.elements[i].render(this.layer.ctx);
			}
			this.layer.ctx.restore();
			region.changed = false;
		}
	}

}