import * as DEither from "@scripts/either";
import type { Segment } from "./constraints";
import { normalize } from "./normalize";
import { isSegment } from "./isSegment";

export function createSegment(
	value: string,
): (
	| DEither.Success<string & Segment>
	| DEither.Error<string>
);

export function createSegment(
	value: string,
) {
	const result = normalize(value);

	if (result && isSegment(result)) {
		return DEither.success(result);
	}

	return DEither.error(value);
}
