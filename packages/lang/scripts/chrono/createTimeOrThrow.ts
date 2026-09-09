import * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import type { SerializedTheTime, SpoolingTime } from "./types";
import * as DEither from "@scripts/either";
import { createTime } from "./createTime";
import type { TheTime } from "./theTime";

export class CreateTheTimeError extends DKind.parentClass(
	createKind("create-the-time-error"),
	Error,
) {
	public constructor(public input: TheTime | number | SpoolingTime | SerializedTheTime) {
		const value = typeof input === "object"
			? JSON.stringify(input)
			: input.toString();

		super(`Invalid date input: ${value}`);
	}
}

export function createTimeOrThrow(
	input: number | TheTime | SpoolingTime | SerializedTheTime,
): TheTime;

export function createTimeOrThrow(
	input: number | TheTime | SpoolingTime | SerializedTheTime,
): TheTime {
	const result = createTime(input as never);

	if (DEither.isLeft(result)) {
		throw new CreateTheTimeError(
			input,
		);
	}

	return DEither.unwrapRight(result);
}
