import type * as DNumber from "@scripts/number";
import { type Number } from "./constraints";

type Stringifyable = (
	| null
	| undefined
	| { toString(): string }
);

type ComputeResult<
	GenericValue extends Stringifyable,
> = GenericValue extends number
	? DNumber.IsLiteral<GenericValue> extends true
		? `${GenericValue}`
		: string & Number
	: GenericValue extends (
		| string
		| boolean
		| null
		| undefined
		| bigint
	)
		? `${GenericValue}`
		: GenericValue extends { toString(): string }
			? ReturnType<GenericValue["toString"]>
			: never;

export function to<
	GenericValue extends Stringifyable,
>(
	value: GenericValue,
): ComputeResult<GenericValue> {
	return `${value as any}` as never;
}
