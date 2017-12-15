import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Texture } from "../Textures/Texture";
import { EventHandler } from "../Core/EventHandler";
import { MemoryCanvas } from "../Core/MemoryCanvas";
import { Entity } from "../Core/Entity";

export class RectRenderComponent extends Component {

	private cache: CanvasRenderingContext2D;
	private renderedCache: CanvasRenderingContext2D;
	public renderCacheDirty: boolean = true;

	public constructor(public width: number, public height: number, public texture: Texture) {
		super();
		this.cache = new MemoryCanvas(width, height).ctx;
		this.renderedCache = new MemoryCanvas(width, height).ctx;
		this.buildCache();
	}

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.events.listen("render", this.render.bind(this));
	}

	public buildCache() {
		this.cache.clearRect(0, 0, this.cache.canvas.width, this.cache.canvas.height);
		this.texture.apply(this.cache, 0, 0, this.width, this.height);
	}

	public buildRenderedCache() {
		this.renderedCache.clearRect(0, 0, this.renderedCache.canvas.width, this.renderedCache.canvas.height);
		this.entity.preRender(this.renderedCache);
		this.entity.transform.apply(this.renderedCache, { origin: false, scale: true, rotate: true });
		this.renderedCache.drawImage(this.cache.canvas, 0, 0);
		this.renderCacheDirty = false;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		if (this.renderCacheDirty) {
			this.buildRenderedCache();
		}
		if (this.entity.parent != null) {
			this.entity.parent.transform.applyRecursive(ctx);
		}
		this.entity.transform.apply(ctx, { origin: true, scale: false, rotate: false });
		ctx.drawImage(this.renderedCache.canvas, 0, 0);

		/* 	this.entity.transform.applyRecursive(ctx);
			this.entity.preRender(ctx);
			ctx.drawImage(this.cache.canvas, 0, 0); */
		ctx.restore();
	}
}