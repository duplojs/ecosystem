import { DuploJSError } from './error';
import { IsEqual, AnyFunction, ObjectKey } from './types';
import type * as DKind from '../kind';
import type * as DObject from '../object';
declare const BuilderStoreSymbol: unique symbol;
type BuilderStoreSymbol = typeof BuilderStoreSymbol;
declare module "./globalStore" {
    interface GlobalStore {
        [BuilderStoreSymbol]: Record<string, Record<string, Parameters<BuilderHandler["set"]>[1]>>;
    }
}
export declare const builderKind: DKind.Handler<DKind.Definition<"@DuplojsLangCommon/builder-base", object>>;
export interface Builder<GenericAccumulator extends object = object, GenericIdentifier extends ObjectKey = never> extends DKind.Kind<typeof builderKind, GenericAccumulator> {
}
declare const builderNextKind: DKind.Handler<DKind.Definition<"@DuplojsLangCommon/builder-next", unknown>>;
interface BuilderNext<GenericValue extends object = object> extends DKind.Kind<typeof builderNextKind, GenericValue> {
}
export interface BuilderHandlerSetFunctionParams<GenericArgs extends unknown[], GenericValue extends object> {
    args: GenericArgs;
    accumulator: GenericValue;
    next(newAccumulator: GenericValue): BuilderNext<GenericValue>;
}
export interface BuilderHandler<GenericBuilder extends Builder = Builder> {
    set<GenericMethodName extends DObject.GetPropsWithValueExtends<GenericBuilder, AnyFunction>, GenericMethod extends Extract<GenericBuilder[GenericMethodName], AnyFunction>>(method: GenericMethodName, theFunction: (params: BuilderHandlerSetFunctionParams<Parameters<GenericMethod>, DKind.GetValue<typeof builderKind, GenericBuilder>>) => IsEqual<keyof ReturnType<GenericMethod>, keyof GenericBuilder> extends true ? BuilderNext<DKind.GetValue<typeof builderKind, GenericBuilder>> : ReturnType<GenericMethod>): BuilderHandler<GenericBuilder>;
    use<GenericCurrentBuilder extends GenericBuilder>(accumulator: DKind.GetValue<typeof builderKind, GenericBuilder>): GenericCurrentBuilder;
}
declare const MissingBuilderMethodsError_base: abstract new (error: string) => DuploJSError<"common-missing-builder-methods-error", string> & DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/duplojs-error-common-missing-builder-methods-error", unknown>>, unknown>;
export declare class MissingBuilderMethodsError extends MissingBuilderMethodsError_base {
    method: string;
    constructor(method: string);
}
export declare function createBuilder<GenericBuilder extends Builder>(builderName: string): BuilderHandler<GenericBuilder>;
export {};
