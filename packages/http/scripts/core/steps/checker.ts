import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import { type StepKind, stepKind } from "./kind";
import { type CheckerFunctionOutput, type Checker } from "@core/checker";
import { type Floor } from "@core/types";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";
import { type PredictedResponse } from "@core/response";
import { type ResponseHelper } from "@core/response/helpers";

export interface CheckerStepOtherwiseParams<
	GenericFloor extends Floor = Floor,
	GenericResult extends CheckerFunctionOutput = CheckerFunctionOutput,
> {
	response: ResponseHelper.Methods400;
	floor: GenericFloor;
	result: GenericResult;
}

export interface CheckerStepDefinition {
	readonly checker: Checker;
	readonly result: string | readonly string[];
	readonly indexing?: string;
	input(input: Floor): unknown;
	options?(input: Floor): Record<string, unknown>;
	otherwise(params: CheckerStepOtherwiseParams): PredictedResponse;
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
