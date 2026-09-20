import { createKind } from "@core/kind";
import { type ResponseCode, Response } from "@core/response";
import * as DKind from "@duplojs/lang/kind";

export class PredictedResponse<
	GenericCode extends ResponseCode = ResponseCode,
	GenericInformation extends string = string,
	GenericBody extends unknown = unknown,
> extends DKind.parentClass(
		createKind("predicted-response"),
		Response,
	)<
		null,
		Response<GenericCode, GenericInformation, GenericBody>
	> {
	public constructor(
		code: GenericCode,
		information: GenericInformation,
		body: GenericBody,
	) {
		super(null, code, information, body);
	}
}
