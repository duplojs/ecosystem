import { createKind } from "@core/kind";
import { Response, type SuccessResponseCode } from "@core/response";
import { type Stream } from "@core/stream";
import type * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";

export class StreamTextPredictedResponse<
	GenericCode extends SuccessResponseCode = SuccessResponseCode,
	GenericInformation extends string = string,
> extends DKind.parentClass(
		createKind("hook-response"),
		Response,
	)<
		null,
		Response<GenericCode, GenericInformation, undefined>
	> {
	public constructor(
		code: GenericCode,
		information: GenericInformation,
		public startStream: (
			params: Stream.StartSendingParams<string>,
		) => DCommon.MaybePromise<void>,
	) {
		super(null, code, information, undefined);
	}
}
