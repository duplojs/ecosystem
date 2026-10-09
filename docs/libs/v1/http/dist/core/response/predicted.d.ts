import { ResponseCode, Response } from '.';
import * as DKind from "@duplojs-v1/lang/kind";
declare const PredictedResponse_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/predicted-response", unknown>>, typeof Response>;
export declare class PredictedResponse<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown> extends PredictedResponse_base<null, Response<GenericCode, GenericInformation, GenericBody>> {
    constructor(code: GenericCode, information: GenericInformation, body: GenericBody);
}
export {};
