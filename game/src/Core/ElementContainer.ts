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

export class ElementRegionContainer {
	public renderRegions: ElementRegion[] = new Array<ElementRegion>();
	public collisionRegions: ElementRegion[] = new Array<ElementRegion>();
}

export class ElementContainer {
	private renderRegions: RegionContainer<ElementRegion>
	private collisionRegions: RegionContainer<ElementRegion>
	private elementRegions: Map<Element, ElementRegionContainer> = new Map<Element, ElementRegionContainer>();
	public elements: Element[] = new Array<Element>();

	public constructor(renderregionsize: number, collisionregionsize: number, public area: Rectangle) {
		this.renderRegions = new RegionContainer(renderregionsize, area, ElementRegion);
		this.collisionRegions = new RegionContainer(collisionregionsize, area, ElementRegion);
	}

	public resize(area: Rectangle): void {
		var elements: Element[] = new Array<Element>();
		for (var i = 0; i < this.elements.length; i++) {
			elements.push(this.elements[i]);
			this.deregister(this.elements[i]);
		}
		this.renderRegions = new RegionContainer(this.renderRegions.len, area, ElementRegion);
		this.collisionRegions = new RegionContainer(this.collisionRegions.len, area, ElementRegion);
		for (var i = 0; i < elements.length; i++) {
			this.register(elements[i]);
		}
	}

	public register(element: Element): void {
		this.elementRegions.set(element, new ElementRegionContainer());
		this.elements.push(element);
		this.change(element, true);
	}

	public deregister(element: Element): void {
		var regions = this.elementRegions.get(element).renderRegions;
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
		var currentregions;
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
			var newregions;
			switch (type) {
				case "render":
					newregions = this.renderRegions.getRegions(element.renderArea);
					break;
				case "collision":
					newregions = this.collisionRegions.getRegions(element.collisionArea);
					break;
			}
			ArrayUtil.diff(currentregions, newregions, added, removed, unchanged);
			for (var i = 0; i < removed.length; i++) {
				this.remove(type, element, removed[i]);
			}
			for (var i = 0; i < added.length; i++) {
				this.add(type, element, added[i]);
			}
			for (var i = 0; i < unchanged.length; i++) {
				unchanged[i].changed = true;
			}
		} else if (type == "render") { // we don't care about collision changes if we are only tweaking an attribute
			for (var i = 0; i < currentregions.length; i++) {
				currentregions[i].changed = true;
			}
		}
	}

	public getRegions(type: string, area: IShape): ElementRegion[] {
		var result: ElementRegion[] = new Array<ElementRegion>();
		var prop;
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
				this.elementRegions.get(element).collisionRegions.push(region);
				region.elements.push(element);
				break;
		}
		region.changed = true;
	}
}
/* 
export class ElementRegion extends Region {
	public elements: Element[] = new Array<Element>();
	public requiresRedraw: boolean = false;
}

export class ElementContainer {

	private regions: RegionContainer<ElementRegion>;
	public elements: Map<Element, ElementRegion[]> = new Map<Element, ElementRegion[]>();
	public regionsCache: ElementRegion[];
	public areasCache: Rectangle[];
	public elementsCache: Element[] = new Array<Element>();

	public constructor(regionsize: number, area: Rectangle) {
		this.regions = new RegionContainer(regionsize, area, ElementRegion);
		this.regionsCache = Array.from(this.regions.regions.values());
		this.areasCache = Array.from(this.regions.regions.keys());
	}

	public resize(area: Rectangle): void {
		var elements: Element[] = new Array<Element>();
		for (var i = 0; i < this.elementsCache.length; i++) {
			elements.push(this.elementsCache[i]);
			this.deregister(this.elementsCache[i]);
		}
		this.regions = new RegionContainer(this.regions.len, area, ElementRegion);
		this.regionsCache = Array.from(this.regions.regions.values());
		this.areasCache = Array.from(this.regions.regions.keys());
		this.elementsCache = new Array<Element>();
		for (var i = 0; i < elements.length; i++) {
			this.register(elements[i]);
		}
	}

	public get area(): Rectangle {
		return this.regions.area;
	}

	public register(element: Element): void {
		if (this.elementsCache.indexOf(element) > -1) {
			throw "Dup registration";
		}
		this.elements.set(element, new Array<ElementRegion>());
		this.update(element, true);
		this.insertSorted(element, this.elementsCache);
	}

	public deregister(element: Element): void {
		var regions: ElementRegion[] = this.elements.get(element);
		for (var i: number = 0; i < regions.length; i++) {
			this.remove(element, regions[i--]);
		}
		this.elementsCache.splice(this.elementsCache.indexOf(element), 1);
		this.elements.delete(element);
	}

	public add(element: Element, region: ElementRegion): void {
		this.insertSorted(element, region.elements);
		this.elements.get(element).push(region);
		region.requiresRedraw = true;
	}

	public remove(element: Element, region: ElementRegion): void {
		region.elements.splice(region.elements.indexOf(element), 1);
		this.elements.get(element).splice(this.elements.get(element).indexOf(region), 1);
		region.requiresRedraw = true;
	}

	public update(element: Element, position: boolean): void {
		var currentregions: ElementRegion[] = this.regions.getRegions(element.renderArea);
		if (position) {
			var oldregions: ElementRegion[] = this.elements.get(element);
			for (var oldregion of oldregions) {
				if (currentregions.indexOf(oldregion) === -1) {
					this.remove(element, oldregion);
				}
			}
			for (var currentregion of currentregions) {
				if (oldregions.indexOf(currentregion) === -1) {
					this.add(element, currentregion);
				} else {
					currentregion.requiresRedraw = true;
				}
			}
		} else {
			for (var i: number = 0; i < currentregions.length; i++) {
				currentregions[i].requiresRedraw = true;
			}
		}
	}

	public getRegions(area: IShape): ElementRegion[] {
		var result: ElementRegion[] = new Array<ElementRegion>();
		for (var i: number = 0; i < this.areasCache.length; i++) {
			if (area.intersects(this.areasCache[i])) {
				result.push(this.regions.regions.get(this.areasCache[i]));
			}
		}
		return result;
	}

	private insertSorted(element: Element, array: Element[]): void {
		array.splice(this.locationOfIndex(element.zIndex, array), 0, element);
	}

	private locationOfIndex(index: number, array: Element[]): number {
		for (var i: number = 0; i < array.length; i++) {
			if (array[i].zIndex >= index) {
				return i;
			}
		}
		return array.length;
	}

} */