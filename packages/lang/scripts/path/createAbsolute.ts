import * as DEither from "@scripts/either";
import type { Absolute } from "./constraints";
import { normalize } from "./normalize";
import { isAbsolute } from "./isAbsolute";

export function createAbsolute(
	value: string,
): (
	| DEither.Success<string & Absolute>
	| DEither.Error<string>
);

export function createAbsolute(
	value: string,
) {
	const result = normalize(value);

	if (result && isAbsolute(result)) {
		return DEither.success(result);
	}

	return DEither.error(value);
}
