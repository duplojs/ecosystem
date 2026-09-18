import { createKind } from "@core/kind";
import { Response, type SuccessResponseCode } from "@core/response";
import { type ServerSentEvents } from "@core/serverSentEvents";
import type * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";

export class ServerSentEventsPredictedResponse<
	GenericCode extends SuccessResponseCode = SuccessResponseCode,
	GenericInformation extends string = string,
	GenericEvents extends ServerSentEvents.DefinitionShape = ServerSentEvents.DefinitionShape,
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
		public startSendingEvents: (
			params: ServerSentEvents.StartSendingParams<GenericEvents>,
		) => DCommon.MaybePromise<void>,
	) {
		super(null, code, information, undefined);
	}
}
