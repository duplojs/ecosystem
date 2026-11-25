import * as DCommon from "@duplojs/lang/common";
export interface ServerFunction {
}
export declare const SupportedEnvironment: {
    BUN: "BUN";
    DENO: "DENO";
    NODE: "NODE";
    TEST: "TEST";
    toTuple: () => readonly ["BUN", "DENO", "NODE", "TEST"];
    has: <GenericValue extends string>(value: GenericValue) => value is GenericValue & ("BUN" | "DENO" | "NODE" | "TEST");
    contract: <GenericContractValue extends string = "BUN" | "DENO" | "NODE" | "TEST">(...args: (Exclude<"BUN", GenericContractValue> | Exclude<"DENO", GenericContractValue> | Exclude<"NODE", GenericContractValue> | Exclude<"TEST", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "BUN" | "DENO" | "NODE" | "TEST"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
export type SupportedEnvironment = DCommon.GetEnumValue<typeof SupportedEnvironment>;
export declare const OS: {
    aix: "aix";
    android: "android";
    cygwin: "cygwin";
    darwin: "darwin";
    freebsd: "freebsd";
    haiku: "haiku";
    illumos: "illumos";
    linux: "linux";
    netbsd: "netbsd";
    openbsd: "openbsd";
    solaris: "solaris";
    windows: "windows";
    toTuple: () => readonly ["aix", "android", "cygwin", "darwin", "freebsd", "haiku", "illumos", "linux", "netbsd", "openbsd", "solaris", "windows"];
    has: <GenericValue extends string>(value: GenericValue) => value is GenericValue & ("aix" | "android" | "cygwin" | "darwin" | "freebsd" | "haiku" | "illumos" | "linux" | "netbsd" | "openbsd" | "solaris" | "windows");
    contract: <GenericContractValue extends string = "aix" | "android" | "cygwin" | "darwin" | "freebsd" | "haiku" | "illumos" | "linux" | "netbsd" | "openbsd" | "solaris" | "windows">(...args: (Exclude<"aix", GenericContractValue> | Exclude<"android", GenericContractValue> | Exclude<"cygwin", GenericContractValue> | Exclude<"darwin", GenericContractValue> | Exclude<"freebsd", GenericContractValue> | Exclude<"haiku", GenericContractValue> | Exclude<"illumos", GenericContractValue> | Exclude<"linux", GenericContractValue> | Exclude<"netbsd", GenericContractValue> | Exclude<"openbsd", GenericContractValue> | Exclude<"solaris", GenericContractValue> | Exclude<"windows", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "aix" | "android" | "cygwin" | "darwin" | "freebsd" | "haiku" | "illumos" | "linux" | "netbsd" | "openbsd" | "solaris" | "windows"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
export type OS = DCommon.GetEnumValue<typeof OS>;
declare const SymbolEnvironmentStore: unique symbol;
type SymbolEnvironmentStore = typeof SymbolEnvironmentStore;
declare module "@duplojs/lang" {
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
export declare const nodeFileSystem: DCommon.Memoized<typeof import("node:fs/promises")>;
export declare const nodeCrypto: DCommon.Memoized<typeof import("node:crypto")>;
export declare const nodeOs: DCommon.Memoized<typeof import("node:os")>;
export declare const nodePath: DCommon.Memoized<import('path').PlatformPath>;
export declare const currentOS: DCommon.Memoized<"aix" | "android" | "cygwin" | "darwin" | "freebsd" | "haiku" | "illumos" | "linux" | "netbsd" | "openbsd" | "solaris" | "windows">;
export {};
