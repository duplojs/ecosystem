import * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "./kind";
import type { Absolute } from "./constraints";
import { createAbsolute } from "./createAbsolute";

export class CreateAbsolutePathError extends DKind.parentClass(
	createKind("create-absolute-path-error"),
	Error,
) {
	public constructor(
		public value: string,
	) {
		super(null, `Invalid absolute path: ${value}`);
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
