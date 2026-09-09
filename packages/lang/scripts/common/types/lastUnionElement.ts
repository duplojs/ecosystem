import type { UnionToIntersection } from "./unionToIntersection";

type LastOf<
	GenericUnion extends unknown,
> = UnionToIntersection<
	GenericUnion extends unknown
		? () => GenericUnion
		: never
> extends () => infer InferredElement
	? InferredElement
	: never;

type Wrap<
	GenericUnion extends unknown,
> = GenericUnion extends any
	? [GenericUnion]
	: never;

type Unwrap<
	GenericLastValue extends unknown,
> = GenericLastValue extends readonly any[]
	? GenericLastValue[number]
	: never;

export type LastUnionElement<
	GenericUnion extends unknown,
> = Unwrap<
	LastOf<
		Wrap<GenericUnion>
	>
>;
