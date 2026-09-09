import { createDate } from "./createDate";
import type { SerializedTheDate, SpoolingDate } from "./types";
import * as DEither from "@scripts/either";
import type { TheDate } from "./theDate";
import * as DKind from "@scripts/kind";
import { createKind } from "./kind";

export class CreateTheDateError extends DKind.parentClass(
	createKind("create-the-date-error"),
	Error,
) {
	public constructor(public input: string | Date | number | SpoolingDate | TheDate) {
		const value = typeof input === "object" && "value" in input
			? JSON.stringify(input)
			: input.toString();

		super(`Invalid date input: ${value}`);
	}
}

export function createDateOrThrow<
	GenericInput extends TheDate | Date | number | SerializedTheDate,
>(
	input: GenericInput,
): TheDate;

export function createDateOrThrow<
	GenericInput extends SpoolingDate,
>(
	input: GenericInput,
): TheDate;

export function createDateOrThrow(
	input: TheDate | Date | number | string | SpoolingDate,
): TheDate {
	const result = createDate(input as never);

	if (DEither.isLeft(result)) {
		throw new CreateTheDateError(
			input,
		);
	}

	return DEither.unwrapRight(result);
}
