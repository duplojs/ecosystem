import * as DCommon from "@duplojs-v1/lang/common";
export * from './hook';
export declare const defaultRouteFunctionBuilder: (route: import('../../../route').Route, params: import('..').RouteFunctionBuilderParams) => DCommon.MaybePromise<import('..').BuildRouteNotSupportEither | import('..').BuildRouteSuccessEither | import('../..').BuildStepNotSupportEither>;
