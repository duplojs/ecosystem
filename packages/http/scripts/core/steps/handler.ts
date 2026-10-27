import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/types";
import { type PredictedResponses } from "@core/response";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";
import { type ResponseHelper } from "@core/response/helpers";
import { type Request } from "@core/request";

export interface HandlerStepFunctionParams {
	readonly request: Request;
	readonly response: DCommon.SimplifyTopLevel<typeof ResponseHelper>;
}

export interface HandlerStepDefinition {
	theFunction(
		floor: Floor,
		params: HandlerStepFunctionParams
	): DCommon.MaybePromise<PredictedResponses>;
	readonly metadata: readonly Metadata[];
}

export const handlerStepKind = createKind("handler-step");

export interface HandlerStep<
	GenericDefinition extends HandlerStepDefinition = HandlerStepDefinition,
> extends DCommon.Forward<
		& DKind.Kind<typeof handlerStepKind>
		& StepKind
	> {
	readonly definition: GenericDefinition;
}

export function createHandlerStep<
	GenericDefinition extends HandlerStepDefinition,
>(
	definition: GenericDefinition,
): HandlerStep<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => handlerStepKind.setTo(value, null),
		(value) => stepKind.setTo(value, null),
	);
}
