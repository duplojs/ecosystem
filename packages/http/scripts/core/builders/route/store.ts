import { type Route } from "@core/route";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";
import * as DCommon from "@duplojs/lang/common";

const SymbolRouteStore = Symbol.for(
	createCoreLibStringIdentifier("route-store"),
);

declare module "@duplojs/lang" {
	interface GlobalStore {
		[SymbolRouteStore]: Set<Route>;
	}
}

export interface RouteStore {
	add(route: Route): void;
	getAll(): Generator<Route>;
}

const privateRouteStore = DCommon.createGlobalStore(SymbolRouteStore, new Set());

export const routeStore: RouteStore = {
	add(route) {
		privateRouteStore.value.add(route);
	},
	*getAll() {
		for (const route of privateRouteStore.value) {
			yield route;
		}
	},
};
