import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { normalize } from "./normalize";

export function create(
	value: string,
): (
	| DEither.Success<string & DPath.Path>
	| DEither.Left<"create-path-error", string>
);

export function create(
	value: string,
) {
	const result = normalize(value);

	if (result !== null) {
		return DEither.success(result);
	}

	return DEither.left("create-path-error", value);
}
