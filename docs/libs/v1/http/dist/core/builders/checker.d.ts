import { CheckerDefinition, Checker, CheckerFunctionOutput, CheckerFunctionParams } from '../checker';
import * as DCommon from "@duplojs-v1/lang/common";
export interface CheckerBuilderParams {
    readonly options?: Record<string, unknown>;
}
export interface CheckerBuilder<GenericParams extends CheckerBuilderParams = CheckerBuilderParams> extends DCommon.Builder<CheckerBuilderParams> {
    handler<GenericInput extends unknown, GenericOutput extends CheckerFunctionOutput>(theFunction: (input: GenericInput, params: CheckerFunctionParams<GenericParams["options"]>) => DCommon.MaybePromise<GenericOutput>): Checker<{
        theFunction(input: GenericInput, params: CheckerFunctionParams<GenericParams["options"]>): DCommon.MaybePromise<GenericOutput>;
        options: GenericParams["options"];
    }>;
}
export declare const checkerBuilder: DCommon.BuilderHandler<CheckerBuilder<CheckerBuilderParams>>;
export declare function useCheckerBuilder<GenericOptions extends CheckerDefinition["options"] = never>(params?: {
    options?: GenericOptions;
}): CheckerBuilder<{
    readonly options: DCommon.NeverCoalescing<GenericOptions, undefined>;
}>;
