import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { createSegment } from "./createSegment";

export class CreateSegmentPathError extends DCommon.DuploJSError.parentClass("path-create-segment-path-error") {
	public constructor(
		public value: string,
	) {
		super(`Invalid segment path: ${value}`);
	}
}

export function createSegmentOrThrow(value: string): string & DPath.Segment & DPath.Path {
	const result = createSegment(value);
	if (DEither.isLeft(result)) {
		throw new CreateSegmentPathError(DEither.unwrapLeft(result));
	}
	return DEither.unwrapRight(result);
}
