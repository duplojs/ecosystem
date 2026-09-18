import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import { createKind } from "../kind";
import { type ProcessStep, type CheckerStep, type CutStep, type ExtractStep, type stepKind, type PresetCheckerStep } from "../steps";
import { type Floor } from "../types/floor";
import { type HookRouteLifeCycle } from "../route";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

export type * from "./types";

export interface ProcessStepsCustom {}

export type ProcessSteps = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| ProcessStepsCustom[
		DObject.GetPropsWithValueExtends<
			ProcessStepsCustom,
			DKind.Kind<typeof stepKind>
		>
	]
	| CheckerStep
	| ExtractStep
	| PresetCheckerStep
	| CutStep
	| ProcessStep
);

declare const SymbolProcessExportValue: unique symbol;

export interface ProcessDefinition {
	readonly steps: readonly ProcessSteps[];
	readonly options?: Record<string, unknown>;
	readonly hooks: readonly HookRouteLifeCycle[];
	readonly metadata: readonly Metadata[];
	[SymbolProcessExportValue]?: Floor;
}

export interface ProcessExportValue<
	GenericExportValue extends Floor,
> {
	[SymbolProcessExportValue]: GenericExportValue;
}

export type GetProcessExportValue<
	GenericProcess extends Process,
> = DCommon.IsEqual<
	GenericProcess["definition"][typeof SymbolProcessExportValue],
	unknown
> extends true
	? never
	: GenericProcess["definition"][typeof SymbolProcessExportValue];

export const processKind = createKind("process");

export interface Process<
	GenericDefinition extends ProcessDefinition = ProcessDefinition,
> extends DKind.Kind<typeof processKind> {
	definition: GenericDefinition;
}

export function createProcess<
	GenericDefinition extends Pick<
		ProcessDefinition,
		"steps" | "options" | "hooks" | "metadata"
	>,
>(
	definition: GenericDefinition,
): Process<GenericDefinition> {
	return processKind.setTo(
		{ definition },
		null,
	);
}
