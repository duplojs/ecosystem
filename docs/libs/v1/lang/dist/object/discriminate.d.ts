import * as DCommon from '../common';
type DiscriminateValue<GenericInput extends object, GenericKey extends keyof GenericInput> = Extract<GenericInput[GenericKey], DCommon.EligibleEqual>;
export declare function discriminate<GenericInput extends object, GenericKey extends keyof GenericInput, GenericValue extends DiscriminateValue<GenericInput, GenericKey>>(key: GenericKey, value: DCommon.MaybeArray<GenericValue>): (input: GenericInput) => input is Extract<GenericInput, {
    [Prop in GenericKey]: GenericValue;
}>;
export declare function discriminate<GenericInput extends object, GenericKey extends keyof GenericInput, GenericValue extends DiscriminateValue<GenericInput, GenericKey>>(input: GenericInput, key: GenericKey, value: DCommon.MaybeArray<GenericValue>): input is Extract<GenericInput, {
    [Prop in GenericKey]: GenericValue;
}>;
export {};
