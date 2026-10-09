import { ResponseCode, Response } from '.';
import { HookRouteLifeCycle } from '../route/hooks';
import * as DKind from "@duplojs-v1/lang/kind";
declare const HookResponse_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/hook-response", unknown>>, typeof Response>;
export declare class HookResponse<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown> extends HookResponse_base<null, Response<GenericCode, GenericInformation, GenericBody>> {
    fromHook: keyof HookRouteLifeCycle;
    constructor(from: keyof HookRouteLifeCycle, code: GenericCode, information: GenericInformation, body: GenericBody);
}
export {};
