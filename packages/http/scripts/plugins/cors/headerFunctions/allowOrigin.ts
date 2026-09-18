import type { Request } from "@core/request";
import type { Response } from "@core/response";
import type * as DCommon from "@duplojs/lang/common";

export const allowOriginFunction = {
	default(allowOrigin: RegExp) {
		return (request: Request, response: Response) => {
			if (allowOrigin.test(request.origin)) {
				response.setHeader("access-control-allow-origin", request.origin);
			}
		};
	},

	isFunction(allowOrigin: (origin: string) => DCommon.MaybePromise<boolean>) {
		return async(request: Request, response: Response) => {
			let result = allowOrigin(request.origin);
			if (result instanceof Promise) {
				result = await result;
			}

			if (result === true) {
				response.setHeader("access-control-allow-origin", request.origin);
			}
		};
	},
};
