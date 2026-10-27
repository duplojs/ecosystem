import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/types";
import { type PredictedResponse } from "@core/response";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";
import { type Request } from "@core/request";
import { type ResponseHelper } from "@core/response/helpers";

export const cutStepOutputKind = createKind("cut-output");

export interface CutStepFunctionOutput<
	GenericData extends Record<string, unknown> = Record<string, unknown>,
> extends DKind.Kind<typeof cutStepOutputKind, GenericData> {

}

export interface CutStepFunctionParams {
	readonly request: Request;
	readonly response: ResponseHelper.Methods400;
	output<
		GenericData extends Record<string, unknown> = never,
	>(
		data?: GenericData,
	): CutStepFunctionOutput<
		DCommon.NeverCoalescing<GenericData, {}>
	>;
}

export interface CutStepDefinition {
	theFunction(
		floor: Floor,
		params: CutStepFunctionParams
	): DCommon.MaybePromise<CutStepFunctionOutput | PredictedResponse>;
	readonly metadata: readonly Metadata[];
}

export const cutStepKind = createKind("cut-step");

export interface CutStep<
	GenericDefinition extends CutStepDefinition = CutStepDefinition,
> extends DCommon.Forward<
		& DKind.Kind<typeof cutStepKind>
		& StepKind
	> {
	readonly definition: GenericDefinition;
}

export function createCutStep<
	GenericDefinition extends CutStepDefinition,
>(
	definition: GenericDefinition,
): CutStep<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => cutStepKind.setTo(value, null),
		(value) => stepKind.setTo(value, null),
	);
}
