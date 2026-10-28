import * as DString from "@duplojs/lang/string";

export function getBody(response: Response): Promise<unknown> {
	const responseContentType = response.headers.get("content-type") ?? undefined;
	const contentDisposition = response.headers.get("content-disposition") ?? "";

	if (!responseContentType || DString.test(contentDisposition, /^attachment(?:\s*;|\s*$)/i)) {
		return Promise.resolve(undefined);
	} else if (responseContentType.includes("json")) {
		return response.json();
	} else if (responseContentType.includes("text")) {
		return response.text();
	} else {
		return Promise.resolve(undefined);
	}
}
