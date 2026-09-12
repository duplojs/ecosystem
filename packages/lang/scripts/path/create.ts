import * as DEither from "@scripts/either";
import type { Path } from "./constraints";
import { normalize } from "./normalize";

export function create(
	value: string,
): (
	| DEither.Success<string & Path>
	| DEither.Error<string>
);

export function create(
	value: string,
) {
	const result = normalize(value);

	if (result) {
		return DEither.success(result);
	}

	return DEither.error(value);
}
