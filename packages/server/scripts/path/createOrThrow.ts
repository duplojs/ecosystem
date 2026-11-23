import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { create } from "./create";

export class CreatePathError extends DCommon.DuploJSError.parentClass("path-create-path-error") {
	public constructor(
		public value: string,
	) {
		super(`Invalid path: ${value}`);
	}
}

export function createOrThrow(value: string): string & DPath.Path {
	const result = create(value);
	if (DEither.isLeft(result)) {
		throw new CreatePathError(DEither.unwrapLeft(result));
	}
	return DEither.unwrapRight(result);
}
