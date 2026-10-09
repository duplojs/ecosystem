import { Response, SuccessResponseCode } from '.';
import { Stream } from '../stream';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DKind from "@duplojs-v1/lang/kind";
declare const StreamPredictedResponse_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/stream-predicted-response", unknown>>, typeof Response>;
export declare class StreamPredictedResponse<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string, GenericFlux extends unknown = unknown> extends StreamPredictedResponse_base<null, Response<GenericCode, GenericInformation, undefined>> {
    startStream: (params: Stream.StartSendingParams<GenericFlux>) => DCommon.MaybePromise<void>;
    constructor(code: GenericCode, information: GenericInformation, startStream: (params: Stream.StartSendingParams<GenericFlux>) => DCommon.MaybePromise<void>);
}
export {};
