/* eslint-disable id-length */
import * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "./kind";

export class InvalidBytesInStringError extends DKind.parentClass(
	createKind("invalid-bytes-in-string-error"),
	Error,
) {
	public constructor(
		public input: string,
	) {
		super(undefined, `Invalid Input: ${input}`);
	}
}

const parseRegExp = /(?<rawValue>[0-9.]+)(?<unit>b|kb|mb|gb|tb|pb)/;

const unitMapper = {
	b: 1,
	kb: 1 << 10,
	mb: 1 << 20,
	gb: 1 << 30,
	tb: Math.pow(1024, 4),
	pb: Math.pow(1024, 5),
};

export type BytesInString = `${number}${keyof typeof unitMapper}`;

export function stringToBytes(bytesInString: BytesInString | number) {
	if (typeof bytesInString === "number") {
		return bytesInString;
	}

	const regExpResults = parseRegExp.exec(bytesInString);

	const { rawValue, unit } = regExpResults?.groups ?? {};
	const value = parseFloat(rawValue ?? "");

	if (isNaN(value) || !unit || !DString.isKeyof(unit, unitMapper)) {
		throw new InvalidBytesInStringError(bytesInString);
	}

	return Math.floor(unitMapper[unit] * value);
}
