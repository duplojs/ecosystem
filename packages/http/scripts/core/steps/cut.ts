import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/types";
import { type StepFunctionParams } from "./types";
import { type PredictedResponse, type ResponseContract } from "@core/response";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

export const cutStepOutputKind = createKind("cut-output");

export interface CutStepFunctionOutput<
	GenericData extends Record<string, unknown> = Record<string, unknown>,
> extends DKind.Kind<typeof cutStepOutputKind, GenericData> {

}

export interface CutStepFunctionParams<
	GenericResponse extends PredictedResponse = PredictedResponse,
> extends StepFunctionParams<GenericResponse> {
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
	readonly responseContract: DCommon.MaybeArray<ResponseContract.Contract>;
	readonly metadata: readonly Metadata[];
}

export const cutStepKind = createKind("cut-step");

export interface CutStep<
	GenericDefinition extends CutStepDefinition = CutStepDefinition,
> extends DCommon.Forward<
		& DKind.Kind<typeof cutStepKind>
		& StepKind
	> {
	definition: GenericDefinition;
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
