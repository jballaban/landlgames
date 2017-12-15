import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Texture } from "../Textures/Texture";
import { EventHandler } from "../Core/EventHandler";
import { MemoryCanvas } from "../Core/MemoryCanvas";
import { Entity } from "../Core/Entity";
import { Shape } from "../Core/Shape";

export class ShapeRenderComponent extends Component {

	private cache: CanvasRenderingContext2D;
	private renderedCache: CanvasRenderingContext2D;
	public renderCacheDirty: boolean = true;

	public constructor(public shape: Shape, public texture: Texture) {
		super();
		this.cache = new MemoryCanvas(shape.right(), shape.bottom()).ctx;
		this.renderedCache = new MemoryCanvas(shape.right(), shape.bottom()).ctx;
		this.buildCache();
	}

	public onAttach(entity: Entity): void {
		super.onAttach(entity);
		entity.events.listen("render", this.render.bind(this));
	}

	public buildCache() {
		this.cache.clearRect(0, 0, this.cache.canvas.width, this.cache.canvas.height);
		this.shape.render(this.cache);
		this.texture.apply(this.cache, 0, 0, this.cache.canvas.width, this.cache.canvas.height);
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
		if (this.shape.centered()) {
			ctx.translate(-Math.floor(this.renderedCache.canvas.width / 2), -Math.floor(this.renderedCache.canvas.height / 2));
		} else {
			ctx.translate(
				-Math.floor((this.renderedCache.canvas.width - this.cache.canvas.width) / 2),
				-Math.floor((this.renderedCache.canvas.height - this.cache.canvas.height) / 2)
			);
		}
		ctx.drawImage(this.renderedCache.canvas, 0, 0);

		/* 	this.entity.transform.applyRecursive(ctx);
			this.entity.preRender(ctx);
			ctx.drawImage(this.cache.canvas, 0, 0); */
		ctx.restore();
	}
}