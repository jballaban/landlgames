import { Component } from "./Component";

export interface IEventManager {
	registerEvents(component: Component);
}