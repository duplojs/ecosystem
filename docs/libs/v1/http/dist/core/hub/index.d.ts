import { Route, HookRouteLifeCycle } from '../route';
import { HookHubLifeCycle } from './hooks';
import { HandlerStepFunctionParams, HandlerStep, ExtractShapeCodecs } from '../steps';
import { BodyController, BodyReaderImplementation, Request } from '../request';
import { PredictedResponses } from '../response';
import { DefaultOtherwiseExtractResponse, Floor, Environment, ExtractOtherwise } from '../types';
import { createStepFunctionBuilder } from '../functionsBuilders/steps';
import { createRouteFunctionBuilder } from '../functionsBuilders/route';
import { createRouterFunctionBuilder } from '../functionsBuilders/router';
import * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";
export * from './hooks';
export * from './defaultNotfoundHandler';
export * from './defaultExtractOtherwise';
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
    defaultExtractOtherwise: ExtractOtherwise<Floor, DefaultOtherwiseExtractResponse>;
    defaultBodyController: BodyController;
    malformedUrlHandler: HandlerStep;
    defaultExtractShapeCodecs: Partial<Record<"params" | "matchedPath" | "method" | "headers" | "url" | "host" | "origin" | "path" | "query" | "filesAttache", import('@duplojs/lang/dataStructure').Codecs<Record<string, import('@duplojs/lang/dataStructure').Codec<import('@duplojs/lang/dataStructure').FundamentalType<unknown>, unknown>>>>>;
    private constructor();
    register(routes: Route | Iterable<Route> | Record<string, Route>): this;
    setRouterFunctionBuilder(functionBuilder: ReturnType<typeof createRouterFunctionBuilder>): this;
    addRouteFunctionBuilder(functionBuilder: DCommon.MaybeArray<ReturnType<typeof createRouteFunctionBuilder>>): this;
    addStepFunctionBuilder(functionBuilder: DCommon.MaybeArray<ReturnType<typeof createStepFunctionBuilder>>): this;
    addRouteHooks(hook: DCommon.MaybeArray<HookRouteLifeCycle>): this;
    addHubHooks(hook: DCommon.MaybeArray<HookHubLifeCycle>): this;
    addBodyReaderImplementation(bodyReaderImplementation: DCommon.MaybeArray<BodyReaderImplementation>): this;
    plug(plugin: HubPlugin | ((self: this) => HubPlugin)): this;
    setNotfoundHandler<const GenericResponse extends PredictedResponses>(theFunction: (param: HandlerStepFunctionParams) => DCommon.MaybePromise<GenericResponse>): this;
    setDefaultExtractOtherwise(otherwise: this["defaultExtractOtherwise"]): this;
    aggregatesHooksHubLifeCycle<GenericHookName extends keyof HookHubLifeCycle>(hookName: GenericHookName): readonly (NonNullable<HookHubLifeCycle[GenericHookName]> extends infer T ? T extends NonNullable<HookHubLifeCycle[GenericHookName]> ? T extends readonly (infer InnerArr)[] ? InnerArr : T : never : never)[];
    setDefaultBodyController(bodyController: BodyController): this;
    aggregatesHooksRouteLifeCycle<GenericHookName extends keyof HookRouteLifeCycle>(hookName: GenericHookName): readonly (NonNullable<HookRouteLifeCycle[GenericHookName]> extends infer T ? T extends NonNullable<HookRouteLifeCycle[GenericHookName]> ? T extends readonly (infer InnerArr)[] ? InnerArr : T : never : never)[];
    setMalformedUrlHandler<const GenericResponse extends PredictedResponses>(theFunction: (param: HandlerStepFunctionParams) => DCommon.MaybePromise<GenericResponse>): this;
    setDefaultExtractShapeCodecs(defaultCodecs: ExtractShapeCodecs): this;
}
export declare function createHub<const GenericConfig extends HubConfig>(config: GenericConfig): Hub<GenericConfig>;
