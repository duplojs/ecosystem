import * as DString from "@duplojs/lang/string";
import { type ClientRequestParams } from "./types";

export function queryToString(query: ClientRequestParams["query"]) {
	if (!query) {
		return null;
	}

	return Object.entries(query)
		.reduce<string[]>(
			(pv, [key, value]) => {
				if (value === undefined) {
					return pv;
				}

				if (value instanceof Array) {
					value.forEach((subValue) => {
						pv.push(`${key}=${DString.to(subValue)}`);
					});
				} else {
					pv.push(`${key}=${DString.to(value)}`);
				}

				return pv;
			},
			[],
		)
		.join("&") || null;
}
