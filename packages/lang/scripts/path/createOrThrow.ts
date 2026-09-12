import * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "./kind";
import type { Path } from "./constraints";
import { create } from "./create";

export class CreatePathError extends DKind.parentClass(
	createKind("create-path-error"),
	Error,
) {
	public constructor(
		public value: string,
	) {
		super(`Invalid path: ${value}`);
	}
}

export function createOrThrow(
	value: string,
): string & Path;

export function createOrThrow(
	value: string,
) {
	const result = create(value);

	if (DEither.isLeft(result)) {
		throw new CreatePathError(
			DEither.unwrapLeft(result),
		);
	}

	return DEither.unwrapRight(result);
}
