import { IShape } from "../Shape/IShape";
import { Rectangle } from "../Shape/Rectangle";
import { RegionContainer, Region } from "./Region";
import { Element } from "./Element";
import { ElementType } from "./ElementType";
import { Array as ArrayUtil } from "../Util/Array";
import { Logger } from "../Util/Logger";

export class ElementRegion extends Region {
	public changed: boolean;
	public elements: Element[] = new Array<Element>();
}

export class CollisionElementRegion extends ElementRegion {
	public removed: Element[] = new Array<Element>();
}

export class ElementRegionContainer {
	public renderRegions: ElementRegion[] = new Array<ElementRegion>();
	public collisionRegions: CollisionElementRegion[] = new Array<CollisionElementRegion>();
}

export class ElementContainer {
	private renderRegions: RegionContainer<ElementRegion>;
	private collisionRegions: RegionContainer<CollisionElementRegion>;
	private elementRegions: Map<Element, ElementRegionContainer> = new Map<Element, ElementRegionContainer>();
	public elements: Element[] = new Array<Element>();

	public constructor(renderregionsize: number, collisionregionsize: number, public area: Rectangle) {
		this.renderRegions = new RegionContainer(renderregionsize, area, ElementRegion);
		this.collisionRegions = new RegionContainer(collisionregionsize, area, CollisionElementRegion);
	}

	public resize(area: Rectangle): void {
		var elements: Element[] = new Array<Element>();
		for (var i: number = 0; i < this.elements.length; i++) {
			elements.push(this.elements[i]);
			this.deregister(this.elements[i]);
		}
		this.area = area;
		this.renderRegions = new RegionContainer(this.renderRegions.len, area, ElementRegion);
		this.collisionRegions = new RegionContainer(this.collisionRegions.len, area, CollisionElementRegion);
		for (var i: number = 0; i < elements.length; i++) {
			this.register(elements[i]);
		}
	}

	public register(element: Element): void {
		this.elementRegions.set(element, new ElementRegionContainer());
		this.elements.push(element);
		this.change(element, true);
	}

	public deregister(element: Element): void {
		var regions: ElementRegion[] = this.elementRegions.get(element).renderRegions;
		for (var i: number = 0; i < regions.length; i++) {
			this.remove("render", element, regions[i--]);
		}
		regions = this.elementRegions.get(element).collisionRegions;
		for (var i: number = 0; i < regions.length; i++) {
			this.remove("collision", element, regions[i--]);
		}
		this.elementRegions.delete(element);
		this.elements.splice(this.elements.indexOf(element), 1);
	}

	public change(element: Element, position: boolean): void {
		this.applyChange("render", element, position);
		if (position) {
			this.applyChange("collision", element, position);
		}
	}

	private applyChange(type: string, element: Element, position: boolean): void {
		var currentregions: ElementRegion[];
		switch (type) {
			case "render":
				currentregions = this.elementRegions.get(element).renderRegions;
				break;
			case "collision":
				currentregions = this.elementRegions.get(element).collisionRegions;
				break;
		}
		if (position) {
			var added: ElementRegion[] = new Array<ElementRegion>();
			var removed: ElementRegion[] = new Array<ElementRegion>();
			var unchanged: ElementRegion[] = new Array<ElementRegion>();
			var newregions: ElementRegion[];
			switch (type) {
				case "render":
					newregions = this.renderRegions.getRegions(element.renderArea);
					break;
				case "collision":
					newregions = this.collisionRegions.getRegions(element.collisionArea);
					break;
			}
			ArrayUtil.diff(currentregions, newregions, added, removed, unchanged);
			for (var i: number = 0; i < removed.length; i++) {
				this.remove(type, element, removed[i]);
			}
			for (var i: number = 0; i < added.length; i++) {
				this.add(type, element, added[i]);
			}
			for (var i: number = 0; i < unchanged.length; i++) {
				unchanged[i].changed = true;
			}
		} else if (type === "render") { // we don't care about collision changes if we are only tweaking an attribute
			for (var i: number = 0; i < currentregions.length; i++) {
				currentregions[i].changed = true;
			}
		}
	}

	public getRegions(type: string, area: IShape): ElementRegion[] {
		var result: ElementRegion[] = new Array<ElementRegion>();
		var prop: RegionContainer<ElementRegion>;
		switch (type) {
			case "render":
				prop = this.renderRegions;
				break;
			case "collision":
				prop = this.collisionRegions;
				break;
		}
		return prop.getRegions(area);
	}

	private remove(type: string, element: Element, region: ElementRegion): void {
		var regions: ElementRegion[];
		switch (type) {
			case "render":
				regions = this.elementRegions.get(element).renderRegions;
				break;
			case "collision":
				regions = this.elementRegions.get(element).collisionRegions;
				(region as CollisionElementRegion).removed.push(element);
				break;
		}
		regions.splice(regions.indexOf(region), 1);
		region.elements.splice(region.elements.indexOf(element), 1);
		region.changed = true;
	}

	private add(type: string, element: Element, region: ElementRegion): void {
		switch (type) {
			case "render":
				this.elementRegions.get(element).renderRegions.push(region);
				ArrayUtil.insertSorted("zIndex", element, region.elements);
				break;
			case "collision":
				this.elementRegions.get(element).collisionRegions.push(region as CollisionElementRegion);
				region.elements.push(element);
				break;
		}
		region.changed = true;
	}
}