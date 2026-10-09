import { Route, HookRouteLifeCycle } from '../route';
import { HookHubLifeCycle } from './hooks';
import { HandlerStepFunctionParams, HandlerStep, ExtractShapeCodecs } from '../steps';
import { BodyController, BodyReaderImplementation, Request } from '../request';
import { ClientErrorResponseCode, ResponseContract } from '../response';
import { Environment } from '../types';
import { createStepFunctionBuilder } from '../functionsBuilders/steps';
import { createRouteFunctionBuilder } from '../functionsBuilders/route';
import { createRouterFunctionBuilder } from '../functionsBuilders/router';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DKind from "@duplojs-v1/lang/kind";
export * from './hooks';
export * from './defaultNotfoundHandler';
export * from './defaultExtractContract';
export * from './defaultBodyController';
export * from './defaultMalformedUrlHandler';
export * from './defaultEmptyReaderImplementation';
export * from './defaultExtractShapeCodecs';
export declare const hubKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/hub", unknown>>;
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
declare const Hub_base: new <GenericKindValue extends unknown = unknown, GenericParentInstance extends never = never>(kindValue: GenericKindValue) => DCommon.NeverCoalescing<GenericParentInstance, {}> & DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/hub", unknown>>, GenericKindValue>;
export declare class Hub<GenericConfig extends HubConfig = HubConfig> extends Hub_base {
    config: GenericConfig;
    plugins: HubPlugin[];
    hooksRouteLifeCycle: HookRouteLifeCycle[];
    hooksHubLifeCycle: HookHubLifeCycle[];
    routes: Set<Route<import('../route').RouteDefinition>>;
    routerFunctionBuilder: ReturnType<typeof createRouterFunctionBuilder> | undefined;
    routeFunctionBuilders: ReturnType<typeof createRouteFunctionBuilder>[];
    stepFunctionBuilders: ReturnType<typeof createStepFunctionBuilder>[];
    bodyReaderImplementations: BodyReaderImplementation[];
    classRequest: typeof Request;
    notfoundHandler: HandlerStep;
    defaultExtractContract: ResponseContract.Contract<ClientErrorResponseCode, string, DDataStructure.Structure<undefined>>;
    defaultBodyController: BodyController;
    malformedUrlHandler: HandlerStep;
    defaultExtractShapeCodecs: Partial<Record<"params" | "matchedPath" | "method" | "headers" | "url" | "host" | "origin" | "path" | "query" | "filesAttache", DDataStructure.Codecs<Record<string, DDataStructure.Codec<DDataStructure.FundamentalType<unknown>, unknown>>>>>;
    private constructor();
    register(routes: Route | Iterable<Route> | Record<string, Route>): this;
    setRouterFunctionBuilder(functionBuilder: ReturnType<typeof createRouterFunctionBuilder>): this;
    addRouteFunctionBuilder(functionBuilder: DCommon.MaybeArray<ReturnType<typeof createRouteFunctionBuilder>>): this;
    addStepFunctionBuilder(functionBuilder: DCommon.MaybeArray<ReturnType<typeof createStepFunctionBuilder>>): this;
    addRouteHooks(hook: DCommon.MaybeArray<HookRouteLifeCycle>): this;
    addHubHooks(hook: DCommon.MaybeArray<HookHubLifeCycle>): this;
    addBodyReaderImplementation(bodyReaderImplementation: DCommon.MaybeArray<BodyReaderImplementation>): this;
    plug(plugin: HubPlugin | ((self: this) => HubPlugin)): this;
    setNotfoundHandler<GenericResponseContract extends ResponseContract.Contract, GenericResponse extends ResponseContract.Convert<GenericResponseContract>>(responseContract: GenericResponseContract, theFunction: (param: HandlerStepFunctionParams<GenericResponse>) => DCommon.MaybePromise<GenericResponse>): this;
    setDefaultExtractContract(responseContract: this["defaultExtractContract"]): this;
    aggregatesHooksHubLifeCycle<GenericHookName extends keyof HookHubLifeCycle>(hookName: GenericHookName): readonly (NonNullable<HookHubLifeCycle[GenericHookName]> extends infer T ? T extends NonNullable<HookHubLifeCycle[GenericHookName]> ? T extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr : InnerArr : T : never : never)[];
    setDefaultBodyController(bodyController: BodyController): this;
    aggregatesHooksRouteLifeCycle<GenericHookName extends keyof HookRouteLifeCycle>(hookName: GenericHookName): readonly (NonNullable<HookRouteLifeCycle[GenericHookName]> extends infer T ? T extends NonNullable<HookRouteLifeCycle[GenericHookName]> ? T extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr : InnerArr : T : never : never)[];
    setMalformedUrlHandler<GenericResponseContract extends ResponseContract.Contract, GenericResponse extends ResponseContract.Convert<GenericResponseContract>>(responseContract: GenericResponseContract, theFunction: (param: HandlerStepFunctionParams<GenericResponse>) => DCommon.MaybePromise<GenericResponse>): this;
    setDefaultExtractShapeCodecs(defaultCodecs: ExtractShapeCodecs): this;
}
export declare function createHub<const GenericConfig extends HubConfig>(config: GenericConfig): Hub<GenericConfig>;
