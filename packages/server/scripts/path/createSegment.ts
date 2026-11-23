import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { normalize } from "./normalize";

export function createSegment(
	value: string,
): (
	| DEither.Success<string & DPath.Segment & DPath.Path>
	| DEither.Left<"create-segment-path-error", string>
);

export function createSegment(
	value: string,
) {
	const result = normalize(value);

	if (result !== null && DPath.isSegment(result)) {
		return DEither.success(result);
	}

	return DEither.left("create-segment-path-error", value);
}
