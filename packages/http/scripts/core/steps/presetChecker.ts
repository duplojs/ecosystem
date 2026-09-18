import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/types";
import { type PresetChecker } from "@core/presetChecker";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

export interface PresetCheckerStepDefinition {
	readonly presetChecker: PresetChecker;
	input(input: Floor): unknown;
	readonly metadata: readonly Metadata[];

}

export const presetCheckerStepKind = createKind("presetChecker-step");

export interface PresetCheckerStep<
	GenericDefinition extends PresetCheckerStepDefinition = PresetCheckerStepDefinition,
> extends DCommon.Forward<
	& DKind.Kind<typeof presetCheckerStepKind>
	& StepKind
	> {
	readonly definition: GenericDefinition;
}

export function createPresetCheckerStep<
	GenericDefinition extends PresetCheckerStepDefinition,
>(
	definition: GenericDefinition,
): PresetCheckerStep<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => presetCheckerStepKind.setTo(value, null),
		(value) => stepKind.setTo(value, null),
	);
}
