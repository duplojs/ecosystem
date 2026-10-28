import { GetCheckerInput, Checker, GetCheckerOptions, GetCheckerResult, CheckerFunctionOutput } from './checker';
import { PredictedResponse } from './response';
import { ResponseHelper } from './response/helpers';
import * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import type * as DKind from "@duplojs/lang/kind";
import type * as DArray from "@duplojs/lang/array";
export interface PresetCheckerOtherwiseParams<GenericResult extends CheckerFunctionOutput = CheckerFunctionOutput> {
    response: ResponseHelper.Methods400;
    result: GenericResult;
}
export interface PresetCheckerDefinition {
    readonly checker: Checker;
    readonly result: string | readonly string[];
    readonly indexing?: string;
    rewriteInput?(input: unknown): unknown;
    readonly options?: Record<string, unknown>;
    otherwise(params: PresetCheckerOtherwiseParams): PredictedResponse;
}
export declare const presetCheckerKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/preset-checker", unknown>>;
export interface PresetChecker<GenericDefinition extends PresetCheckerDefinition = PresetCheckerDefinition> extends DKind.Kind<typeof presetCheckerKind> {
    readonly definition: GenericDefinition;
    indexing<GenericIndex extends string>(indexing: GenericIndex): PresetChecker<DObject.Assign<GenericDefinition, {
        readonly indexing: GenericIndex;
    }>>;
    rewriteInput<GenericInput extends unknown>(rewriteInput: (input: GenericInput) => GetCheckerInput<GenericDefinition["checker"]>): PresetChecker<DObject.Assign<GenericDefinition, {
        rewriteInput(input: GenericInput): GetCheckerInput<GenericDefinition["checker"]>;
    }>>;
    options<const GenericOptions extends GetCheckerOptions<GenericDefinition["checker"]>>(options: GenericOptions): PresetChecker<DObject.Assign<GenericDefinition, {
        readonly options: GenericOptions;
    }>>;
}
export declare function createPresetChecker<GenericChecker extends Checker, const GenericResultInformation extends DCommon.MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>, const GenericDefinition extends {
    readonly indexing?: string;
    rewriteInput?(input: unknown): GetCheckerInput<GenericChecker>;
    readonly options?: GetCheckerOptions<GenericChecker>;
    otherwise(params: PresetCheckerOtherwiseParams<Exclude<Awaited<GetCheckerResult<GenericChecker>>, {
        information: DArray.Unwrap<GenericResultInformation>;
    }>>): PredictedResponse;
}>(checker: GenericChecker, { otherwise, ...definition }: (GenericDefinition & {
    readonly result: GenericResultInformation;
})): PresetChecker<DObject.Assign<GenericDefinition, {
    readonly result: GenericResultInformation;
    readonly checker: GenericChecker;
}>>;
export type GetPresetCheckerInput<GenericPresetChecker extends PresetChecker> = GenericPresetChecker["definition"]["rewriteInput"] extends DCommon.AnyFunction ? Parameters<GenericPresetChecker["definition"]["rewriteInput"]>[0] : Parameters<GenericPresetChecker["definition"]["checker"]["definition"]["theFunction"]>[0];
export type GetPresetCheckerResult<GenericPresetChecker extends PresetChecker> = ReturnType<GenericPresetChecker["definition"]["checker"]["definition"]["theFunction"]>;
export type GetPresetCheckerIndex<GenericPresetChecker extends PresetChecker> = GenericPresetChecker["definition"]["indexing"] extends string ? GenericPresetChecker["definition"]["indexing"] : never;
export type GetPresetCheckerInformation<GenericPresetChecker extends PresetChecker> = GenericPresetChecker["definition"]["result"];
