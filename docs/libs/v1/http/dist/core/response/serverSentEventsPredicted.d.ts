import { Response, SuccessResponseCode } from '.';
import { ServerSentEvents } from '../serverSentEvents';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DKind from "@duplojs-v1/lang/kind";
declare const ServerSentEventsPredictedResponse_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/server-sent-events-predicted-response", unknown>>, typeof Response>;
export declare class ServerSentEventsPredictedResponse<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string, GenericEvents extends ServerSentEvents.DefinitionShape = ServerSentEvents.DefinitionShape> extends ServerSentEventsPredictedResponse_base<null, Response<GenericCode, GenericInformation, undefined>> {
    startSendingEvents: (params: ServerSentEvents.StartSendingParams<GenericEvents>) => DCommon.MaybePromise<void>;
    constructor(code: GenericCode, information: GenericInformation, startSendingEvents: (params: ServerSentEvents.StartSendingParams<GenericEvents>) => DCommon.MaybePromise<void>);
}
export {};
