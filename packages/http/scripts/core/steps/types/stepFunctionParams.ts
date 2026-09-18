import { type Request } from "@core/request";
import { type PredictedResponse } from "@core/response";
import type * as DCommon from "@duplojs/lang/common";

export interface StepFunctionParams<
	GenericResponse extends PredictedResponse = PredictedResponse,
> {
	request: Request;
	response<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		...args: DCommon.Or<[
			DCommon.IsEqual<GenericFilteredResponse["body"], unknown>,
			DCommon.IsEqual<GenericFilteredResponse["body"], undefined>,
		]> extends true
			? [body?: NoInfer<GenericFilteredResponse["body"]>]
			: [body: NoInfer<GenericFilteredResponse["body"]>]
	): GenericFilteredResponse;
}
