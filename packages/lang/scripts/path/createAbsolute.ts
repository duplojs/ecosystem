import * as DEither from "@scripts/either";
import type { Absolute, Path } from "./constraints";
import { normalize } from "./normalize";
import { isAbsolute } from "./isAbsolute";

export function createAbsolute(
	value: string,
): (
	| DEither.Success<string & Absolute & Path>
	| DEither.Left<"create-absolute-path-error", string>
);

export function createAbsolute(
	value: string,
) {
	const result = normalize(value);

	if (result && isAbsolute(result)) {
		return DEither.success(result);
	}

	return DEither.left("create-absolute-path-error", value);
}
