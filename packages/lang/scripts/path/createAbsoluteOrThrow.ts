import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import type { Absolute } from "./constraints";
import { createAbsolute } from "./createAbsolute";

export class CreateAbsolutePathError extends DCommon.DuploJSError.parentClass("path-create-absolute-path-error") {
	public constructor(
		public value: string,
	) {
		super(`Invalid absolute path: ${value}`);
	}
}

export function createAbsoluteOrThrow(
	value: string,
): string & Absolute;

export function createAbsoluteOrThrow(
	value: string,
) {
	const result = createAbsolute(value);

	if (DEither.isLeft(result)) {
		throw new CreateAbsolutePathError(
			DEither.unwrapLeft(result),
		);
	}

	return DEither.unwrapRight(result);
}
