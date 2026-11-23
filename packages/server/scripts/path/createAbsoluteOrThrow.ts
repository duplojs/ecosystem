import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { createAbsolute } from "./createAbsolute";

export class CreateAbsolutePathError extends DCommon.DuploJSError.parentClass("path-create-absolute-path-error") {
	public constructor(
		public value: string,
	) {
		super(`Invalid absolute path: ${value}`);
	}
}

export function createAbsoluteOrThrow(value: string): string & DPath.Absolute & DPath.Path {
	const result = createAbsolute(value);
	if (DEither.isLeft(result)) {
		throw new CreateAbsolutePathError(DEither.unwrapLeft(result));
	}
	return DEither.unwrapRight(result);
}
