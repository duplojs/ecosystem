import * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "./kind";
import type { Segment } from "./constraints";
import { createSegment } from "./createSegment";

export class CreateSegmentPathError extends DKind.parentClass(
	createKind("create-segment-path-error"),
	Error,
) {
	public constructor(
		public value: string,
	) {
		super(null, `Invalid segment path: ${value}`);
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
