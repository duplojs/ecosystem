import { Response, SuccessResponseCode } from '.';
import { Stream } from '../stream';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DKind from "@duplojs-v1/lang/kind";
declare const StreamTextPredictedResponse_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/stream-text-predicted-response", unknown>>, typeof Response>;
export declare class StreamTextPredictedResponse<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string> extends StreamTextPredictedResponse_base<null, Response<GenericCode, GenericInformation, undefined>> {
    startStream: (params: Stream.StartSendingParams<string>) => DCommon.MaybePromise<void>;
    constructor(code: GenericCode, information: GenericInformation, startStream: (params: Stream.StartSendingParams<string>) => DCommon.MaybePromise<void>);
}
export {};
