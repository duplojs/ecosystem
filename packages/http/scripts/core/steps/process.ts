import { createKind } from "@core/kind";
import { type StepKind, stepKind } from "./kind";
import { type Process } from "@core/process";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";
import * as DCommon from "@duplojs/lang/common";

export interface ProcessStepDefinition {
	readonly process: Process;
	readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
	readonly imports?: readonly string[];
	readonly metadata: readonly Metadata[];
}

export const processStepKind = createKind("process-step");

export interface ProcessStep<
	GenericDefinition extends ProcessStepDefinition = ProcessStepDefinition,
> extends DCommon.Forward<
	& DKind.Kind<typeof processStepKind>
	& StepKind
	> {
	definition: GenericDefinition;
}

export function createProcessStep<
	GenericDefinition extends ProcessStepDefinition,
>(
	definition: GenericDefinition,
): ProcessStep<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => processStepKind.setTo(value, null),
		(value) => stepKind.setTo(value, null),
	);
}
