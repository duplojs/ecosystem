import type { Trimmed } from "../constraints";

export function isTrimmed<
	GenericString extends string,
>(input: GenericString): input is GenericString & Trimmed;

export function isTrimmed(
	input: string,
) {
	return input.trim() === input;
}
