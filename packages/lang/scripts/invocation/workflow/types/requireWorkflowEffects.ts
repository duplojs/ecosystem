import type * as DCommon from "@scripts/common";
import type { Effect } from "../effects";

export type RequireWorkflowEffects<
	GenericWorkflow extends DCommon.AnyFunction<any[], Generator<any>>,
> = ReturnType<GenericWorkflow> extends Generator<Effect>
	? unknown
	: DCommon.ComputedTypeError<"Workflow must only yield supported effects.">;
