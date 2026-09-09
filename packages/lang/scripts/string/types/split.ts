import type * as DCommon from "@scripts/common";
import type * as DTuple from "@scripts/tuple";
import type { Includes } from "./includes";
import type { IsKeyPattern } from "./isKeyPattern";

type _Split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number = number,
	GenericLastResult extends readonly string[] = [],
> = GenericString extends `${infer InferredBefore}${GenericSeparator}${infer InferredAfter}`
	? IsKeyPattern<InferredBefore> extends true
		? GenericLastResult
		: readonly [...GenericLastResult, InferredBefore] extends infer InferredResult extends readonly any[]
			? DCommon.IsEqual<InferredAfter, ""> extends true
				? DCommon.IsEqual<GenericSeparator, ""> extends true
					? InferredResult
					: readonly [...InferredResult, InferredAfter]
				: DCommon.IsEqual<InferredResult["length"], 250> extends true
					? Includes<InferredAfter, GenericSeparator> extends true
						? readonly [...InferredResult, ...string[]]
						: InferredResult
					: DCommon.IsEqual<InferredResult["length"], GenericLimit> extends true
						? InferredResult
						: _Split<
							InferredAfter,
							GenericSeparator,
							GenericLimit,
							InferredResult
						>
			: never
	: readonly [...GenericLastResult, GenericString];

export type Split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number = number,
> = DCommon.IsEqual<GenericLimit, 0> extends true
	? readonly []
	: IsKeyPattern<GenericSeparator> extends true
		? readonly [string, ...string[]]
		: IsKeyPattern<GenericString> extends true
			? readonly [
				...DTuple.Create<
					string,
					DTuple.CountMinElement<
						_Split<
							GenericString,
							GenericSeparator,
							GenericLimit
						>
					>
				>,
				...string[],
			]
			: _Split<
				GenericString,
				GenericSeparator,
				GenericLimit
			>;
