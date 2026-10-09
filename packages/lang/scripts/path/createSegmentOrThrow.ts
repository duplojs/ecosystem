import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import type { Segment } from "./constraints";
import { createSegment } from "./createSegment";

export class CreateSegmentPathError extends DCommon.DuploJSError.parentClass("path-create-segment-path-error") {
	public constructor(
		public value: string,
	) {
		super(`Invalid segment path: ${value}`);
	}
}

export function createSegmentOrThrow(
	value: string,
): string & Segment;

export function createSegmentOrThrow(
	value: string,
) {
	const result = createSegment(value);

	if (DEither.isLeft(result)) {
		throw new CreateSegmentPathError(
			DEither.unwrapLeft(result),
		);
	}

	return DEither.unwrapRight(result);
}
