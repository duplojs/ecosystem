import { type Route } from "@core/route";
import type * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import { type Hub } from ".";
import { createKind } from "@core/kind";
import { type RouterParams } from "@core/router";
import { type HttpServerParams } from "@core/types";
import type * as DKind from "@duplojs/lang/kind";

export const hookServerExitKind = createKind("server-hook-exit");

export interface ServerHookExit extends DKind.Kind<typeof hookServerExitKind> {

}

export const hookServerNextKind = createKind("server-hook-next");

export interface ServerHookNext extends DKind.Kind<typeof hookServerNextKind> {

}

export type HookBeforeBuildRoute = (
	route: Route,
) => DCommon.MaybePromise<Route>;

export async function launchHookBeforeBuildRoute(
	hooks: Iterable<HookBeforeBuildRoute>,
	route: Route,
) {
	return DGenerator.asyncReduce(
		hooks,
		DGenerator.reduceFrom(route),
		async({
			item: hook,
			lastValue,
			next,
		}) => next(await hook(lastValue)),
	);
}

export type HookBeforeServerBuildRoutes = (
	hub: Hub,
	httpServerParams: HttpServerParams,
) => DCommon.MaybePromise<Hub | DCommon.EscapeVoid>;

export type HookBeforeStartServer = (
	hub: Hub,
	httpServerParams: HttpServerParams,
) => DCommon.MaybePromise<Hub | DCommon.EscapeVoid>;

export type HookAfterStartServer = (
	hub: Hub,
	httpServerParams: HttpServerParams,
) => DCommon.MaybePromise<Hub | DCommon.EscapeVoid>;

export async function launchHookServer(
	hooks: Iterable<HookBeforeStartServer | HookAfterStartServer | HookBeforeServerBuildRoutes>,
	hub: Hub,
	httpServerParams: HttpServerParams,
) {
	for (const hook of hooks) {
		await hook(hub, httpServerParams);
	}
}

export interface HttpServerErrorParams {
	readonly error: unknown;
	next(): ServerHookNext;
	exit(): ServerHookExit;
	routerInitializationData: RouterParams;
}

export type HookServerError = (
	httpServerErrorParams: HttpServerErrorParams,
) => DCommon.MaybePromise<ServerHookExit | ServerHookNext>;

const hookExit = hookServerExitKind.setTo({}, null);
const hookNext = hookServerNextKind.setTo({}, null);

export function serverErrorExitHookFunction() {
	return hookExit;
}

export function serverErrorNextHookFunction() {
	return hookNext;
}

export async function launchHookServerError(
	hooks: readonly HookServerError[],
	params: HttpServerErrorParams,
) {
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let index = 0; index < hooks.length; index++) {
		const result = await hooks[index]!(params);

		if (hookServerExitKind.has(result)) {
			return;
		}
	}
}

export interface HookHubLifeCycle {
	beforeBuildRoute?: HookBeforeBuildRoute;
	beforeStartServer?: HookBeforeStartServer;
	afterStartServer?: HookAfterStartServer;
	beforeServerBuildRoutes?: HookBeforeServerBuildRoutes;
	serverError?: HookServerError;
}

export function createHookHubLifeCycle(
	hookHubLifeCycle: HookHubLifeCycle,
) {
	return hookHubLifeCycle;
}
