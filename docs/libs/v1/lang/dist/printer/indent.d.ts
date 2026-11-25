import * as DCommon from '../common';
export declare const Indent: {
    tab: "tab";
    space1: "space1";
    space2: "space2";
    space3: "space3";
    space4: "space4";
    toTuple: () => readonly ["tab", "space1", "space2", "space3", "space4"];
    has: <GenericValue extends string>(value: GenericValue) => value is GenericValue & ("tab" | "space1" | "space2" | "space3" | "space4");
    contract: <GenericContractValue extends string = "tab" | "space1" | "space2" | "space3" | "space4">(...args: (Exclude<"tab", GenericContractValue> | Exclude<"space1", GenericContractValue> | Exclude<"space2", GenericContractValue> | Exclude<"space3", GenericContractValue> | Exclude<"space4", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "tab" | "space1" | "space2" | "space3" | "space4"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
export type Indent = DCommon.GetEnumValue<typeof Indent>;
