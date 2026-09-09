/* eslint-disable id-length */
import * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "./kind";

export class InvalidMillisecondInStringError extends DKind.parentClass(
	createKind("invalid-millisecond-in-string-error"),
	Error,
) {
	public constructor(
		public input: string,
	) {
		super(undefined, `Invalid Input: ${input}`);
	}
}

const unitMapper = {
	ms: 1,
	s: 1000,
	m: 60_000,
	h: 3_600_000,
	d: 86_400_000,
	w: 604_800_000,
};

const parseRegExp = /(?<rawValue>[0-9.]+)(?<unit>ms|s|m|h|d|w)/;

export type TimeInString = `${number}${keyof typeof unitMapper}`;

export function stringToMillisecond(
	millisecondInString: TimeInString | number,
	...millisecondInStrings: (TimeInString | number)[]
): number {
	if (typeof millisecondInString === "number") {
		return millisecondInString;
	}

	const result = parseRegExp.exec(millisecondInString);

	const { rawValue, unit } = result?.groups ?? {};
	const value = parseFloat(rawValue ?? "");

	if (isNaN(value) || !unit || !DString.isKeyof(unit, unitMapper)) {
		throw new InvalidMillisecondInStringError(millisecondInString);
	}

	const millisecond = Math.floor(value * unitMapper[unit]);

	const [otherMillisecondInString, ...restMillisecondInStrings] = millisecondInStrings;

	if (otherMillisecondInString) {
		return millisecond + stringToMillisecond(otherMillisecondInString, ...restMillisecondInStrings);
	}

	return millisecond;
}
