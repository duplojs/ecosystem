import * as DEither from "@scripts/either";
import type { Path, Segment } from "./constraints";
import { normalize } from "./normalize";
import { isSegment } from "./isSegment";

export function createSegment(
	value: string,
): (
	| DEither.Success<string & Segment & Path>
	| DEither.Left<"create-segment-path-error", string>
);

export function createSegment(
	value: string,
) {
	const result = normalize(value);

	if (result && isSegment(result)) {
		return DEither.success(result);
	}

	return DEither.left("create-segment-path-error", value);
}
