import { createKind } from "@core/kind";
import { type Route, type HookRouteLifeCycle, routeKind } from "@core/route";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DObject from "@duplojs/lang/object";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPattern from "@duplojs/lang/pattern";
import { type HookHubLifeCycle } from "./hooks";
import { type HandlerStepFunctionParams, type HandlerStep, createHandlerStep } from "@core/steps";
import { type BodyController, type BodyReaderImplementation, Request } from "@core/request";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { defaultNotfoundHandler } from "./defaultNotfoundHandler";
import { type Environment } from "@core/types";
import { defaultExtractContract } from "./defaultExtractContract";
import { type createStepFunctionBuilder } from "@core/functionsBuilders/steps";
import { type createRouteFunctionBuilder } from "@core/functionsBuilders/route";
import { defaultBodyController } from "./defaultBodyController";
import { defaultMalformedUrlHandler } from "./defaultMalformedUrlHandler";
import { defaultEmptyReaderImplementation } from "./defaultEmptyReaderImplementation";
import { type createRouterFunctionBuilder } from "@core/functionsBuilders/router";
import * as DKind from "@duplojs/lang/kind";

export * from "./hooks";
export * from "./defaultNotfoundHandler";
export * from "./defaultExtractContract";
export * from "./defaultBodyController";
export * from "./defaultMalformedUrlHandler";
export * from "./defaultEmptyReaderImplementation";

export const hubKind = createKind("hub");

export interface HubConfig {
	readonly environment: Environment;
}

export interface HubPlugin {
	readonly name: string;
	readonly hooksRouteLifeCycle?: readonly HookRouteLifeCycle[];
	readonly hooksHubLifeCycle?: readonly HookHubLifeCycle[];
	readonly routes?: readonly Route[];
	readonly routeFunctionBuilders?: readonly ReturnType<typeof createRouteFunctionBuilder>[];
	readonly stepFunctionBuilders?: readonly ReturnType<typeof createStepFunctionBuilder>[];
	readonly bodyReaderImplementations?: readonly BodyReaderImplementation[];
}

export class Hub<
	GenericConfig extends HubConfig = HubConfig,
> extends DKind.parentClass(
		createKind("hub"),
	) {
	public plugins: HubPlugin[] = [];

	public hooksRouteLifeCycle: HookRouteLifeCycle[] = [];

	public hooksHubLifeCycle: HookHubLifeCycle[] = [];

	public routes = new Set<Route>();

	public routerFunctionBuilder: ReturnType<typeof createRouterFunctionBuilder> | undefined = undefined;

	public routeFunctionBuilders: ReturnType<typeof createRouteFunctionBuilder>[] = [];

	public stepFunctionBuilders: ReturnType<typeof createStepFunctionBuilder>[] = [];

	public bodyReaderImplementations: BodyReaderImplementation[] = [defaultEmptyReaderImplementation];

	public classRequest = Request;

	public notfoundHandler: HandlerStep = defaultNotfoundHandler;

	public defaultExtractContract: ResponseContract.Contract<
		ClientErrorResponseCode,
		string,
		DDataStructure.Structure<undefined>
	> = defaultExtractContract;

	public defaultBodyController: BodyController = defaultBodyController;

	public malformedUrlHandler: HandlerStep = defaultMalformedUrlHandler;

	private constructor(
		public config: GenericConfig,
	) {
		super(null);
	}

	public register(
		routes: Route | Iterable<Route> | Record<string, Route>,
	) {
		DCommon.pipe(
			routes,
			DPattern.when(
				routeKind.has,
				DArray.coalescing,
			),
			DPattern.when(
				DCommon.isType("iterable"),
				DArray.from,
			),
			DPattern.otherwise(DObject.values),
			DArray.map((route) => this.routes.add(route)),
		);

		return this;
	}

	public setRouterFunctionBuilder(
		functionBuilder: ReturnType<typeof createRouterFunctionBuilder>,
	) {
		this.routerFunctionBuilder = functionBuilder;
		return this;
	}

	public addRouteFunctionBuilder(
		functionBuilder: DCommon.MaybeArray<ReturnType<typeof createRouteFunctionBuilder>>,
	) {
		this.routeFunctionBuilders.push(...DArray.coalescing(functionBuilder));
		return this;
	}

	public addStepFunctionBuilder(
		functionBuilder: DCommon.MaybeArray<ReturnType<typeof createStepFunctionBuilder>>,
	) {
		this.stepFunctionBuilders.push(...DArray.coalescing(functionBuilder));
		return this;
	}

	public addRouteHooks(
		hook: DCommon.MaybeArray<HookRouteLifeCycle>,
	) {
		this.hooksRouteLifeCycle.push(...DArray.coalescing(hook));
		return this;
	}

	public addHubHooks(
		hook: DCommon.MaybeArray<HookHubLifeCycle>,
	) {
		this.hooksHubLifeCycle.push(...DArray.coalescing(hook));
		return this;
	}

	public addBodyReaderImplementation(
		bodyReaderImplementation: DCommon.MaybeArray<BodyReaderImplementation>,
	) {
		this.bodyReaderImplementations.push(...DArray.coalescing(bodyReaderImplementation));
		return this;
	}

	public plug(
		plugin: HubPlugin | ((self: this) => HubPlugin),
	) {
		const pluginResult = typeof plugin === "function"
			? plugin(this)
			: plugin;

		if (pluginResult.bodyReaderImplementations) {
			this.addBodyReaderImplementation(pluginResult.bodyReaderImplementations);
		}

		if (pluginResult.hooksHubLifeCycle) {
			this.addHubHooks(pluginResult.hooksHubLifeCycle);
		}

		if (pluginResult.hooksRouteLifeCycle) {
			this.addRouteHooks(pluginResult.hooksRouteLifeCycle);
		}

		if (pluginResult.routeFunctionBuilders) {
			this.addRouteFunctionBuilder(pluginResult.routeFunctionBuilders);
		}

		if (pluginResult.routes) {
			this.register(pluginResult.routes);
		}

		if (pluginResult.stepFunctionBuilders) {
			this.addStepFunctionBuilder(pluginResult.stepFunctionBuilders);
		}

		this.plugins.push(pluginResult);

		return this;
	}

	public setNotfoundHandler<
		GenericResponseContract extends ResponseContract.Contract,
		GenericResponse extends ResponseContract.Convert<
			GenericResponseContract
		>,
	>(
		responseContract: GenericResponseContract,
		theFunction: (
			param: HandlerStepFunctionParams<
				GenericResponse
			>,
		) => DCommon.MaybePromise<GenericResponse>,
	) {
		this.notfoundHandler = createHandlerStep({
			responseContract,
			theFunction: (floor, params) => theFunction(params),
			metadata: [],
		});

		return this;
	}

	public setDefaultExtractContract(
		responseContract: this["defaultExtractContract"],
	) {
		this.defaultExtractContract = responseContract;

		return this;
	}

	public aggregatesHooksHubLifeCycle<
		GenericHookName extends keyof HookHubLifeCycle,
	>(hookName: GenericHookName) {
		return DArray.flatMap(
			this.hooksHubLifeCycle,
			(hooks) => hooks[hookName] ?? [],
		);
	}

	public setDefaultBodyController(bodyController: BodyController) {
		this.defaultBodyController = bodyController;

		return this;
	}

	public aggregatesHooksRouteLifeCycle<
		GenericHookName extends keyof HookRouteLifeCycle,
	>(hookName: GenericHookName) {
		return DArray.flatMap(
			this.hooksRouteLifeCycle,
			(hooks) => hooks[hookName] ?? [],
		);
	}

	public setMalformedUrlHandler<
		GenericResponseContract extends ResponseContract.Contract,
		GenericResponse extends ResponseContract.Convert<
			GenericResponseContract
		>,
	>(
		responseContract: GenericResponseContract,
		theFunction: (
			param: HandlerStepFunctionParams<
				GenericResponse
			>,
		) => DCommon.MaybePromise<GenericResponse>,
	) {
		this.malformedUrlHandler = createHandlerStep({
			responseContract,
			theFunction: (__, params) => theFunction(params),
			metadata: [],
		});

		return this;
	}

	/**
	 * @internal
	 */
	public static "new"<
		GenericConfig extends HubConfig,
	>(config: GenericConfig) {
		return new Hub(config);
	}
}

export function createHub<
	const GenericConfig extends HubConfig,
>(
	config: GenericConfig,
) {
	return Hub.new(config);
}
