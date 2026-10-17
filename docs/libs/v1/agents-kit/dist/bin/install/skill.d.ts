import * as DCommon from "@duplojs/lang/common";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
export declare const AgentTypeEnum: {
    default: "default";
    claude: "claude";
    codex: "codex";
    toTuple: () => readonly ["default", "claude", "codex"];
    has: <GenericValue extends string>(value: GenericValue) => value is GenericValue & ("default" | "claude" | "codex");
    contract: <GenericContractValue extends string = "default" | "claude" | "codex">(...args: (Exclude<"default", GenericContractValue> | Exclude<"claude", GenericContractValue> | Exclude<"codex", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "default" | "claude" | "codex"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
type AgentTypeEnum = DCommon.GetEnumValue<typeof AgentTypeEnum>;
export declare const SkillEnum: {
    fundamental: "fundamental";
    "http-server": "http-server";
    "http-client": "http-client";
    command: "command";
    server: "server";
    modeling: "modeling";
    test: "test";
    toTuple: () => readonly ["fundamental", "http-server", "http-client", "command", "server", "modeling", "test"];
    has: <GenericValue extends string>(value: GenericValue) => value is GenericValue & ("fundamental" | "http-server" | "http-client" | "command" | "server" | "modeling" | "test");
    contract: <GenericContractValue extends string = "fundamental" | "http-server" | "http-client" | "command" | "server" | "modeling" | "test">(...args: (Exclude<"fundamental", GenericContractValue> | Exclude<"http-server", GenericContractValue> | Exclude<"http-client", GenericContractValue> | Exclude<"command", GenericContractValue> | Exclude<"server", GenericContractValue> | Exclude<"modeling", GenericContractValue> | Exclude<"test", GenericContractValue> extends infer InferredMissingValue extends string ? DCommon.IsNever<InferredMissingValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract is missing value "${InferredMissingValue}".`> : never) & (Exclude<GenericContractValue, "fundamental" | "http-server" | "http-client" | "command" | "server" | "modeling" | "test"> extends infer InferredUnknownValue extends string ? DCommon.IsNever<InferredUnknownValue> extends true ? unknown : DCommon.ComputedTypeError<`Enum contract contains unknown value "${InferredUnknownValue}".`> : never) extends infer InferredRequirement ? DCommon.IsEqual<InferredRequirement, unknown> extends true ? [] : [] & InferredRequirement : never) => /*elided*/ any;
};
type SkillEnum = DCommon.GetEnumValue<typeof SkillEnum>;
export declare function copySkill(agentType: AgentTypeEnum, skill: SkillEnum): Promise<DEither.Error<unknown> | DEither.Left<"file-system-remove-error", DSFile.RemoveErrors> | DEither.Right<"file-system-copy", void> | DEither.Left<"file-system-copy-error", DSFile.CopyErrors>>;
export declare function symlinkSkill(agentType: AgentTypeEnum, skill: SkillEnum): Promise<DEither.Error<unknown> | DEither.Left<"file-system-remove-error", DSFile.RemoveErrors> | DEither.Left<"file-system-ensure-directory-error", DSFile.EnsureDirectoryErrors> | DEither.Right<"file-system-symlink", void> | DEither.Left<"file-system-symlink-error", DSFile.SymlinkErrors>>;
export {};
