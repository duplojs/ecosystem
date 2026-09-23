import * as DString from "@duplojs/lang/string";
import { type ClientRequestParams } from "./types";

export function insertParamsInPath(path: string, params: ClientRequestParams["params"]) {
	if (!params) {
		return path;
	}

	return Object.entries(params).reduce(
		(pv, [key, value]) => value !== undefined
			? pv.replace(`{${key}}`, DString.to(value))
			: pv,
		path,
	);
}
