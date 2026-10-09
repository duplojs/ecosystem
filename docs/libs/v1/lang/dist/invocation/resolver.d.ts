import * as DCommon from '../common';
import type * as DKind from '../kind';
import type * as DObject from '../object';
import * as DEither from '../either';
export declare const resolverKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/resolver", unknown>>;
export interface Resolver<GenericValue extends unknown = unknown, GenericSubscribers extends Record<string, (value: GenericValue) => unknown> = Record<string, (value: GenericValue) => unknown>> extends DKind.Kind<typeof resolverKind> {
    runAndResolve<GenericOutput extends DCommon.MaybePromise<DEither.Right | DEither.Left | undefined | DCommon.EscapeVoid>, const GenericWrapperSubscribers extends GenericSubscribers, GenericOutputHandlerLeft extends unknown = never>(theFunction: (value: GenericValue) => GenericOutput, subscribers: GenericWrapperSubscribers, ...args: (DCommon.ContainExtends<Extract<Awaited<GenericOutput> | Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>, DEither.Left>, DEither.Left> extends true ? [
        whenLeft: (result: Extract<Awaited<GenericOutput> | Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>, DEither.Left>, value: GenericValue) => GenericOutputHandlerLeft
    ] : [])): Promise<(DCommon.IsNever<GenericOutputHandlerLeft> extends true ? never : DEither.Left<"resolve-error", Awaited<GenericOutputHandlerLeft>>) | DEither.Right<"resolve-success", GenericValue>>;
    resolve<const GenericWrapperSubscribers extends GenericSubscribers, GenericOutputHandlerLeft extends unknown = never>(subscribers: GenericWrapperSubscribers, ...args: (DCommon.ContainExtends<Extract<Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>, DEither.Left>, DEither.Left> extends true ? [
        whenLeft: (result: Extract<Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>, DEither.Left>, value: GenericValue) => GenericOutputHandlerLeft
    ] : [])): Promise<(DCommon.IsNever<GenericOutputHandlerLeft> extends true ? never : DEither.Left<"resolve-error", Awaited<GenericOutputHandlerLeft>>) | DEither.Right<"resolve-success", GenericValue>>;
}
export declare function createResolver<const GenericValue extends unknown>(value: GenericValue): <GenericSubscribers extends (Record<string, (value: GenericValue) => unknown> | DCommon.AnyTuple<string>)>() => Resolver<GenericValue, GenericSubscribers extends readonly string[] ? Record<GenericSubscribers[number], (value: GenericValue) => unknown> : GenericSubscribers>;
