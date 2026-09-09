import { type Number } from "./constraints";
import { type NumberInString } from "./types";

type ComputeResult<
	GenericValue extends string,
> = GenericValue extends Number
	? GenericValue
	: GenericValue extends NumberInString
		? GenericValue
		: GenericValue & Number;

const numberRegex = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i;

export function isNumber<
	GenericValue extends string,
>(string: GenericValue): string is ComputeResult<GenericValue>;

export function isNumber(
	string: string,
) {
	return numberRegex.test(string);
}
