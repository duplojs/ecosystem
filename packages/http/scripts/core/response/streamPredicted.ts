import { createKind } from "@core/kind";
import { Response, type SuccessResponseCode } from "@core/response";
import { type Stream } from "@core/stream";
import type * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";

export class StreamPredictedResponse<
	GenericCode extends SuccessResponseCode = SuccessResponseCode,
	GenericInformation extends string = string,
	GenericFlux extends unknown = unknown,
> extends DKind.parentClass(
		createKind("stream-predicted-response"),
		Response,
	)<
		null,
		Response<GenericCode, GenericInformation, undefined>
	> {
	public constructor(
		code: GenericCode,
		information: GenericInformation,
		public startStream: (
			params: Stream.StartSendingParams<GenericFlux>,
		) => DCommon.MaybePromise<void>,
	) {
		super(null, code, information, undefined);
	}
}
