import type * as DCommon from "@scripts/common";
import { type IsLiteral } from "./isLiteral";

export type IsTemplateLiteral<
	GenericString extends string,
> = string extends GenericString
	? false
	: DCommon.IsNever<GenericString> extends true
		? false
		: DCommon.RemoveConstraint<GenericString> extends infer InferredClearValue extends string
			? DCommon.Or<[
				DCommon.IsEqual<InferredClearValue, string>,
				IsLiteral<InferredClearValue>,
			]> extends true
				? false
				: DCommon.IsEqual<
					(
						InferredClearValue extends (
					& string
					& infer InferredRest
						)
							? InferredRest
							: never
					),
					InferredClearValue
				>
			: false;

