import { StepKind } from './kind';
import { Request } from '../request';
import { ClientErrorResponseCode, ResponseContract } from '../response';
import { Metadata } from '../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DKind from "@duplojs-v1/lang/kind";
export interface DisabledExtractKeysCustom {
}
export type DisabledExtractKeys = DObject.GetPropsWithValue<DisabledExtractKeysCustom, true>;
export type ExtractShape<GenericRequest extends Request = Request> = Partial<Record<Exclude<keyof GenericRequest, DObject.GetPropsWithValueExtends<GenericRequest, DCommon.AnyFunction> | DisabledExtractKeys | "body" | "bodyReader" | "params" | symbol>, DDataStructure.Structure | Record<string, DDataStructure.Structure>> & {
    body: (DDataStructure.Structure | Record<string, DDataStructure.Structure>);
    params: Record<string, DDataStructure.Structure>;
}>;
export type ExtractShapeCodecs = Partial<Record<Exclude<keyof ExtractShape, "body">, DDataStructure.Codecs>>;
export interface ExtractStepDefinition {
    readonly shape: ExtractShape;
    readonly responseContract?: ResponseContract.Contract<ClientErrorResponseCode, string, DDataStructure.Structure<undefined>>;
    readonly metadata: readonly Metadata[];
}
export declare const extractStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/extract-step", unknown>>;
export interface ExtractStep<GenericDefinition extends ExtractStepDefinition = ExtractStepDefinition> extends DCommon.Forward<DKind.Kind<typeof extractStepKind> & StepKind> {
    readonly definition: GenericDefinition;
}
export declare function createExtractStep<GenericDefinition extends ExtractStepDefinition>(definition: GenericDefinition): ExtractStep<GenericDefinition>;
