import { type ComputedTypeError } from "../../types";

declare const CastErrorValueSymbol: unique symbol;
declare const CastErrorExpectedValueSymbol: unique symbol;

export type RemoveCastError<
	GenericValue extends unknown,
> = GenericValue extends CastError<
	infer InferredMessage,
	infer InferredValue,
	infer InferredExpectedValue
>
	? GenericValue extends (
		& infer InferredValue
		& CastError<InferredMessage, InferredValue, InferredExpectedValue>
	)
		? InferredValue
		: GenericValue
	: GenericValue;

export interface CastError<
	GenericReason extends string,
	GenericValue extends unknown,
	GenericExpectedValue extends unknown,
> extends ComputedTypeError<GenericReason> {
	[CastErrorValueSymbol]: RemoveCastError<GenericValue>;
	[CastErrorExpectedValueSymbol]: GenericExpectedValue;
}
