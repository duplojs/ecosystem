import type * as DCommon from "@scripts/common";
import type { Format } from "../format";

export type ApplyFormat<
	GenericValue extends string,
> = GenericValue extends Format<string, infer InferredValue>
	? (
		& GenericValue
		& DCommon.UnionToIntersection<InferredValue>
	)
	: GenericValue;
