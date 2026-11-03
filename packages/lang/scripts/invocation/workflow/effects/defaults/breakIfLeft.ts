import type * as DCommon from "@scripts/common";
import type * as DEither from "@scripts/either";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../../kind";
import { workflowEffectKind, type WorkflowEffect } from "../base";

export const workflowEffectBreakIfLeftKind = createKind<
	"workflow-effect-break-if-left",
	DEither.Left | DEither.Right
>("workflow-effect-break-if-left");

export interface WorkflowEffectBreakIfLeft<
	GenericInput extends DEither.Left | DEither.Right = DEither.Left | DEither.Right,
> extends DCommon.Forward<
		& DKind.Kind<typeof workflowEffectBreakIfLeftKind, GenericInput>
		& WorkflowEffect<"break-if-left">
	> {
}

export function *workflowBreakIfLeftGenerator<
	GenericInput extends DEither.Left | DEither.Right,
>(
	input: GenericInput,
): Generator<
	WorkflowEffectBreakIfLeft<GenericInput>,
	DEither.GetValue<Extract<GenericInput, DEither.Right>>
> {
	const effect = workflowEffectKind.addTo({}, "break-if-left");

	return yield workflowEffectBreakIfLeftKind.addTo(effect, input);
}
