import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import { type StepKind, stepKind } from "./kind";
import { type Checker } from "@core/checker";
import { type Floor } from "@core/types";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";
import type * as DDataStructure from "@duplojs/lang/dataStructure";

export interface CheckerStepDefinition {
	readonly checker: Checker;
	readonly result: string | readonly string[];
	readonly indexing?: string;
	input(input: Floor): unknown;
	readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
	readonly responseContract: ResponseContract.Contract<
		ClientErrorResponseCode,
		string,
		DDataStructure.Structure<undefined>
	>;
	readonly metadata: readonly Metadata[];
}

export const checkerStepKind = createKind("checker-step");

export interface CheckerStep<
	GenericDefinition extends CheckerStepDefinition = CheckerStepDefinition,
> extends DCommon.Forward<
		& DKind.Kind<typeof checkerStepKind>
		& StepKind
	> {
	readonly definition: GenericDefinition;
}

export function createCheckerStep<
	GenericDefinition extends CheckerStepDefinition,
>(
	definition: GenericDefinition,
): CheckerStep<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => checkerStepKind.setTo(value, null),
		(value) => stepKind.setTo(value, null),
	);
}
