import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../../kind";
import { type Effect, workflowEffectKind, type WorkflowEffect } from "../base";
import type { RequireWorkflowEffects } from "../../types";

export const workflowEffectIterateKind = createKind("workflow-effect-iterate");

export interface WorkflowEffectIterate<
	GenericName extends string = string,
	GenericInput extends unknown[] = unknown[],
	GenericIteratorFunction extends DCommon.AnyFunction<[item: any], Generator<any>> =
		DCommon.AnyFunction<[item: any], Generator<Effect>>,
> extends DCommon.Forward<
		& DKind.Kind<typeof workflowEffectIterateKind, GenericInput>
		& WorkflowEffect<`iterate/${GenericName}`>
	> {
	readonly input: GenericInput;
	readonly iteratorFunction: GenericIteratorFunction;
}

export function workflowIterateGenerator<
	GenericName extends string,
	GenericInput extends unknown[],
>(
	name: GenericName,
	...args: GenericInput
): <
	GenericIteratorFunction extends DCommon.AnyFunction<[item: any], Generator<any>>,
>(iteratorFunction: (
	& GenericIteratorFunction
	& RequireWorkflowEffects<NoInfer<GenericIteratorFunction>>
)) => Generator<
	WorkflowEffectIterate<
		GenericName,
		GenericInput,
		GenericIteratorFunction
	>,
	void
> {
	return function *(iteratorFunction) {
		yield {
			[workflowEffectIterateKind.runTimeKey]: null,
			[workflowEffectKind.runTimeKey]: `iterate/${name}`,
			input: args,
			iteratorFunction,
		} satisfies DKind.Remove<
			WorkflowEffectIterate
		> as never;
	};
}
