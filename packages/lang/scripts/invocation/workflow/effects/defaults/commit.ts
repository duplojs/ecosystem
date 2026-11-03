import * as DCommon from "@scripts/common";
import { createKind } from "../../../kind";
import { workflowEffectKind, type WorkflowEffect } from "../base";
import type * as DKind from "@scripts/kind";

export const workflowEffectCommitKind = createKind<
	"workflow-effect-commit",
	DCommon.AnyFunction
>("workflow-effect-commit");

export interface WorkflowEffectCommit<
	GenericName extends string = string,
	GenericFunction extends DCommon.AnyFunction = DCommon.AnyFunction,
> extends DCommon.Forward<
		& DKind.Kind<
			typeof workflowEffectCommitKind,
			GenericFunction
		>
		& WorkflowEffect<
			`commit/${GenericName}`
		>
	> {
	readonly input: Parameters<GenericFunction>;
}

export interface WorkflowCommitGenerator<
	GenericName extends string = string,
	GenericInput extends unknown[] = unknown[],
> extends Generator<
		WorkflowEffectCommit<
			GenericName,
			(...args: GenericInput) => unknown
		>,
		void
	> {
	withSignature<
		GenericFunction extends DCommon.AnyFunction<GenericInput>,
	>(): Generator<
		WorkflowEffectCommit<
			GenericName,
			GenericFunction
		>,
		void
	>;
}

export function workflowCommitGenerator<
	GenericName extends string,
	GenericInput extends unknown[],
>(
	name: GenericName,
	...args: GenericInput
) {
	const generator = DCommon.justExec(function *(): Generator<any, any> {
		yield {
			[workflowEffectCommitKind.runTimeKey]: null,
			[workflowEffectKind.runTimeKey]: `commit/${name}`,
			input: args,
		} satisfies DKind.Remove<
			WorkflowEffectCommit
		>;
	}) as WorkflowCommitGenerator<
		GenericName,
		GenericInput
	>;

	generator.withSignature = () => generator as never;

	return generator;
}
