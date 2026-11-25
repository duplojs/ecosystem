import type * as DCommon from '../common';
import type * as DKind from '../kind';
export interface BeforeStepFunctionParams<GenericOutput extends unknown, GenericFunction extends DCommon.AnyFunction> {
    output: GenericOutput;
    nextFunction: GenericFunction;
}
export declare const stepKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/step", unknown>>;
export interface Step<GenericOutput extends unknown = unknown, GenericFunction extends DCommon.AnyFunction = DCommon.AnyFunction> extends DKind.Kind<typeof stepKind> {
    run<GenericOutputBeforeStep extends DCommon.MaybePromise<ReturnType<GenericFunction>>>(beforeStepFunction: (params: BeforeStepFunctionParams<GenericOutput, GenericFunction>) => GenericOutputBeforeStep): GenericOutputBeforeStep;
}
export declare function createStep<GenericOutput extends unknown, GenericFunction extends DCommon.AnyFunction>(output: GenericOutput, nextFunction: GenericFunction): Step<GenericOutput, GenericFunction>;
