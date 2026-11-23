import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { normalize } from "./normalize";

export function createAbsolute(
	value: string,
): (
	| DEither.Success<string & DPath.Absolute & DPath.Path>
	| DEither.Left<"create-absolute-path-error", string>
);

export function createAbsolute(
	value: string,
) {
	const result = normalize(value);

	if (result !== null && DPath.isAbsolute(result)) {
		return DEither.success(result);
	}

	return DEither.left("create-absolute-path-error", value);
}
