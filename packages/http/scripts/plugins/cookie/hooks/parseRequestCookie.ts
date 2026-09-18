import { createHookRouteLifeCycle } from "@core/route";
import { type Parser } from "../parser";

interface ParseRequestCookieHookParams {
	parser: Parser;
}

export function parseRequestCookieHook(params: ParseRequestCookieHookParams) {
	return createHookRouteLifeCycle({
		beforeRouteExecution: ({ request, next }) => {
			if (request.headers.cookie) {
				const cookieValue = request.headers.cookie instanceof Array
					? request.headers.cookie.join("; ")
					: request.headers.cookie;

				request.cookies = params.parser(cookieValue);
			}

			return next();
		},
	});
}
