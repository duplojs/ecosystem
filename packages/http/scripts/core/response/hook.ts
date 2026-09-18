import { createKind } from "@core/kind";
import { type ResponseCode, Response } from "@core/response";
import { type HookRouteLifeCycle } from "../route/hooks";
import * as DKind from "@duplojs/lang/kind";

export class HookResponse<
	GenericCode extends ResponseCode = ResponseCode,
	GenericInformation extends string = string,
	GenericBody extends unknown = unknown,
> extends DKind.parentClass(
		createKind("hook-response"),
		Response,
	)<
		null,
		Response<GenericCode, GenericInformation, GenericBody>
	> {
	public fromHook: keyof HookRouteLifeCycle;

	public constructor(
		from: keyof HookRouteLifeCycle,
		code: GenericCode,
		information: GenericInformation,
		body: GenericBody,
	) {
		super(null, code, information, body);
		this.fromHook = from;
	}
}

