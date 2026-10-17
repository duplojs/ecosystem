import * as DCommon from "@duplojs/lang/common";
import * as DSCommand from "@duplojs/server/command";
export * from './instructions';
export declare const SetupTypeEnum: {
    default: "default";
    claude: "claude";
    toTuple: () => readonly ["default", "claude"];
    has: <GenericValue extends string>(value: GenericValue) => value is GenericValue & ("default" | "claude");
    contract: <GenericContractValue extends string = "default" | "claude">(...args: (Exclude<"default", GenericContractValue> | Exclude<"claude", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "default" | "claude"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
export type SetupTypeEnum = DCommon.GetEnumValue<typeof SetupTypeEnum>;
export declare const setupCommand: DSCommand.Command<"setup">;
