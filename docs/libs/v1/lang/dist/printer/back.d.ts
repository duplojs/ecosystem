import * as DCommon from '../common';
export declare const Back: {
    LF: "LF";
    CRLF: "CRLF";
    toTuple: () => readonly ["LF", "CRLF"];
    has: <GenericValue extends string>(value: GenericValue) => value is GenericValue & ("LF" | "CRLF");
    contract: <GenericContractValue extends string = "LF" | "CRLF">(...args: (Exclude<"LF", GenericContractValue> | Exclude<"CRLF", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "LF" | "CRLF"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
export type Back = DCommon.GetEnumValue<typeof Back>;
