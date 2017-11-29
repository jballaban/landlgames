import { Entity } from "./Entity";
import { Vector3D } from "./Vector";
import { Logger } from "../Util/Logger";
import { Component, RenderComponent } from "./Component";
import { Composer } from "../Foundation/Composer";
import { Camera } from "./Camera";

export abstract class Model extends Entity {

	constructor() {
		super();
		this.alpha = 1;
		this.layerIndex = 0;
	}

	public get layerIndex(): number { return this.getAttribute<number>("layerIndex"); }

	public set layerIndex(value: number) { this.setAttribute("layerIndex", value); }

	public get alpha(): number { return this.getAttribute<number>("alpha"); }

	public set alpha(value: number) {
		this.setAttribute("alpha", Math.min(1, value));
	}

	public getEffectiveAlpha(): number {
		return this.getEffectiveAttribute("alpha", Composer.NumberMultiply);
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

}