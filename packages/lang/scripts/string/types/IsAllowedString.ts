import { type IsLiteral } from "./isLiteral";

type _IsAllowedTail<
	GenericValue extends string,
	GenericAllowed extends string,
> =
	GenericValue extends `${infer Char}${infer Rest}`
		? Char extends GenericAllowed
			? _IsAllowedTail<Rest, GenericAllowed>
			: false
		: true;

type _IsAllowedString<
	GenericValue extends string,
	GenericAllowed extends string,
> =
	GenericValue extends `${infer InferredA}${infer InferredB}${infer InferredC}${infer InferredD}${infer InferredE}${infer InferredF}${infer InferredG}${infer InferredH}${infer InferredRest}`
		? (
			| InferredA
			| InferredB
			| InferredC
			| InferredD
			| InferredE
			| InferredF
			| InferredG
			| InferredH
		) extends GenericAllowed
			? IsAllowedString<InferredRest, GenericAllowed>
			: false
		: _IsAllowedTail<GenericValue, GenericAllowed>;

export type IsAllowedString<
	GenericValue extends string,
	GenericAllowed extends string,
> = IsLiteral<GenericValue> extends true
	? _IsAllowedString<GenericValue, GenericAllowed>
	: false;
