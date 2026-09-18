import { type RouterElement } from "./routerElement";

export type RouterElementWrapper = Record<
	string,
	readonly RouterElement[]
>;
