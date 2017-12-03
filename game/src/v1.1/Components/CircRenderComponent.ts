import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { RenderComponent } from "./RenderComponent";
import { Texture } from "../Textures/Texture";
import { EventHandler } from "../Core/EventHandler";
import { Canvas } from "../Core/Canvas";
import { MemoryCanvas } from "../Core/MemoryCanvas";

export class CircRenderComponent extends RenderComponent {

	private cache: CanvasRenderingContext2D;
	private renderedCache: CanvasRenderingContext2D;
	public renderCacheDirty: boolean = true;

	public constructor(public radius: number, public texture: Texture) {
		super();
		this.cache = new MemoryCanvas(this.radius * 2, this.radius * 2).ctx;
		this.renderedCache = new MemoryCanvas(this.radius * 2, this.radius * 2).ctx;
		this.buildCache();
	}

	public registerEvents(events: EventHandler): void {
		events.listen("render", this.render.bind(this));
	}

	public buildCache(): void {
		this.cache.clearRect(0, 0, this.cache.canvas.width, this.cache.canvas.height);
		this.cache.beginPath();
		this.cache.arc(Math.floor(this.radius), Math.floor(this.radius), Math.floor(this.radius), 0, 2 * Math.PI);
		this.cache.clip();
		this.texture.apply(this.cache, 0, 0, this.radius * 2, this.radius * 2);
	}

	public buildRenderedCache(): void {
		this.renderedCache.clearRect(0, 0, this.renderedCache.canvas.width, this.renderedCache.canvas.height);
		this.entity.preRender(this.renderedCache);
		this.entity.transform.apply(this.renderedCache);
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
		ctx.translate(-Math.floor(this.radius), -Math.floor(this.radius));
		ctx.drawImage(this.renderedCache.canvas, 0, 0);
		ctx.restore();
		//Logger.log(this.entity.transform.origin);
		/* 	let origin = this.entity.transform.getEffectiveOrigin(cameraOrigin, cameraScale, cameraRotate);
			let scale = this.entity.transform.getEffectiveScale(cameraScale);
			let rotate = this.entity.transform.getEffectiveRotate(cameraRotate);
			ctx.save();
			ctx.translate(origin.x, origin.y);
			ctx.rotate(rotate.z * Math.PI / 180);
			//	ctx.translate(-this.width * scale.x / 2, -this.height * scale.y / 2);
			this.texture.apply(ctx, 0, 0, this.width * scale.x, this.height * scale.y);
			ctx.restore(); */
	}
}