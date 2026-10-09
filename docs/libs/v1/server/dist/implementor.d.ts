import * as DCommon from "@duplojs-v1/lang/common";
export interface ServerFunction {
}
export declare const SupportedEnvironment: {
    BUN: "BUN";
    DENO: "DENO";
    NODE: "NODE";
    TEST: "TEST";
    toTuple: () => readonly ["BUN", "DENO", "NODE", "TEST"];
    has: (value: string) => value is "BUN" | "DENO" | "NODE" | "TEST";
    contract: <GenericContractValue extends string = "BUN" | "DENO" | "NODE" | "TEST">(...args: (Exclude<"BUN", GenericContractValue> | Exclude<"DENO", GenericContractValue> | Exclude<"NODE", GenericContractValue> | Exclude<"TEST", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "BUN" | "DENO" | "NODE" | "TEST"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
export type SupportedEnvironment = DCommon.GetEnumValue<typeof SupportedEnvironment>;
declare const SymbolEnvironmentStore: unique symbol;
type SymbolEnvironmentStore = typeof SymbolEnvironmentStore;
declare module "@duplojs-v1/lang" {
    interface GlobalStore {
        [SymbolEnvironmentStore]: SupportedEnvironment;
    }
}
export declare function setEnvironment(environment: SupportedEnvironment): void;
export declare namespace TESTImplementation {
    function clear(): void;
    function set<GenericFunctionName extends keyof ServerFunction>(functionName: GenericFunctionName, theFunction: ServerFunction[GenericFunctionName]): ServerFunction[GenericFunctionName];
    function get<GenericFunctionName extends keyof ServerFunction>(functionName: GenericFunctionName): ServerFunction[GenericFunctionName] | undefined;
}
export declare function implementFunction<GenericFunctionName extends keyof ServerFunction>(functionName: GenericFunctionName, theFunctions: {
    NODE: ServerFunction[GenericFunctionName];
    BUN?: ServerFunction[GenericFunctionName];
    DENO?: ServerFunction[GenericFunctionName];
}): ServerFunction[GenericFunctionName];
export declare const nodeFileSystem: DCommon.MemoizedPromise<typeof import("node:fs/promises")>;
export declare const nodeCrypto: DCommon.MemoizedPromise<typeof import("node:crypto")>;
export declare const nodeOs: DCommon.MemoizedPromise<typeof import("node:os")>;
export {};
