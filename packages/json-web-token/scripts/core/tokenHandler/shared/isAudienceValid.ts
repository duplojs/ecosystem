import * as DArray from "@duplojs/lang/array";

export function isAudienceValid(
	expectedAudience: string | readonly string[] | undefined,
	tokenAudience: string | readonly string[] | undefined,
) {
	if (typeof expectedAudience === "undefined") {
		return true;
	}

	if (typeof tokenAudience === "undefined") {
		return false;
	}

	const expected = DArray.coalescing(expectedAudience);
	const actual = DArray.coalescing(tokenAudience);

	return expected.some(
		(value) => actual.includes(value),
	);
}
