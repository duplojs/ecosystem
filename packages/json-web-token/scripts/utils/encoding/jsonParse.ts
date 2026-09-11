import type * as DCommon from "@duplojs/lang/common";

export function jsonParse(value: string) {
	try {
		return JSON.parse(value) as DCommon.Json;
	} catch {
		return undefined;
	}
}
