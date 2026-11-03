import * as DCommon from "@scripts/common";
import { createKind } from "../../../kind";
import { workflowEffectKind, type WorkflowEffect } from "../base";
import type * as DKind from "@scripts/kind";

export const workflowEffectResolveKind = createKind<
	"workflow-effect-resolve",
	{
		readonly input: unknown[];
		readonly output: unknown;
	}
>("workflow-effect-resolve");

export interface WorkflowEffectResolve<
	GenericName extends string = string,
	GenericInput extends unknown[] = unknown[],
	GenericOutput extends unknown = unknown,
> extends DCommon.Forward<
		& DKind.Kind<
			typeof workflowEffectResolveKind,
			{
				readonly input: GenericInput;
				readonly output: GenericOutput;
			}
		>
		& WorkflowEffect<`resolve/${GenericName}`>
	> {
	readonly input: GenericInput;
}

export interface WorkflowResolveGenerator<
	GenericName extends string = string,
	GenericInput extends unknown[] = unknown[],
	GenericOutput extends unknown = unknown,
> extends Generator<
		WorkflowEffectResolve<
			GenericName,
			GenericInput,
			GenericOutput
		>,
		GenericOutput
	> {
	expect<
		GenericExpectOutput extends GenericOutput,
	>(): Generator<
		WorkflowEffectResolve<
			GenericName,
			GenericInput,
			GenericExpectOutput
		>,
		GenericExpectOutput
	>;
}

export function workflowResolveGenerator<
	GenericName extends string,
	const GenericInput extends unknown[],
	GenericOutput extends unknown,
>(
	name: GenericName,
	...args: GenericInput
) {
	const generator = DCommon.justExec(function *(): Generator<any, any> {
		return yield {
			[workflowEffectResolveKind.runTimeKey]: null,
			[workflowEffectKind.runTimeKey]: `resolve/${name}`,
			input: args,
		} satisfies DKind.Remove<
			WorkflowEffectResolve
		>;
	}) as WorkflowResolveGenerator<
		GenericName,
		GenericInput,
		GenericOutput
	>;

	generator.expect = () => generator as never;

	return generator;
}
