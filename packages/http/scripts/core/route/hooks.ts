import { type Request } from "../request";
import { createKind } from "../kind";
import { type HookResponse } from "../response";
import { type ResponseCode, type Response } from "@core/response";
import type * as DKind from "@duplojs/lang/kind";
import type * as DCommon from "@duplojs/lang/common";

export const hookRouteExitKind = createKind("route-hook-exit");

export interface RouteHookExit extends DKind.Kind<typeof hookRouteExitKind> {

}

export const hookRouteNextKind = createKind("route-hook-next");

export interface RouteHookNext extends DKind.Kind<typeof hookRouteNextKind> {

}

export interface RouteHookParams {
	readonly request: Request;
	next(): RouteHookNext;
	exit(): RouteHookExit;
	response<
		GenericCode extends ResponseCode = ResponseCode,
		GenericInformation extends string = string,
		GenericBody extends unknown = unknown,
	>(
		code: GenericCode,
		information: GenericInformation,
		body?: GenericBody,
	): HookResponse<
		GenericCode,
		GenericInformation,
		GenericBody | undefined
	>;
}

export type HookBeforeRouteExecution = (
	params: RouteHookParams,
) => DCommon.MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;

export interface RouteHookErrorParams<
	GenericRequest extends Request = Request,
> {
	readonly request: GenericRequest;
	readonly error: unknown;
	next(): RouteHookNext;
	exit(): RouteHookExit;
	response<
		GenericCode extends ResponseCode = ResponseCode,
		GenericInformation extends string = string,
		GenericBody extends unknown = unknown,
	>(
		code: GenericCode,
		information: GenericInformation,
		body?: GenericBody,
	): HookResponse<
		GenericCode,
		GenericInformation,
		GenericBody | undefined
	>;
}

export type HookError = (
	params: RouteHookErrorParams<Request>,
) => DCommon.MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;

export interface RouteHookParamsAfter {
	readonly request: Request;
	readonly currentResponse: Response;
	next(): RouteHookNext;
	exit(): RouteHookExit;
}

export type HookBeforeSendResponse = (
	params: RouteHookParamsAfter,
) => DCommon.MaybePromise<RouteHookExit | RouteHookNext>;

export type HookSendResponse = (
	params: RouteHookParamsAfter,
) => DCommon.MaybePromise<RouteHookExit | RouteHookNext>;

export type HookAfterSendResponse = (
	params: RouteHookParamsAfter,
) => DCommon.MaybePromise<RouteHookExit | RouteHookNext>;

export interface HookRouteLifeCycle {
	beforeRouteExecution?: HookBeforeRouteExecution;
	error?: HookError;
	beforeSendResponse?: HookBeforeSendResponse;
	sendResponse?: HookSendResponse;
	afterSendResponse?: HookAfterSendResponse;
}

export function createHookRouteLifeCycle<
	const GenericHookLiveCycle extends HookRouteLifeCycle,
>(
	hookRouteLifeCycle: GenericHookLiveCycle,
) {
	return hookRouteLifeCycle;
}
