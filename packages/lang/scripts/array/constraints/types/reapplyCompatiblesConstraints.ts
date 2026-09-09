import type * as DCommon from "@scripts/common";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMaxElements, MaxElements } from "../maxElements";
import type { ExtractMinElements, MinElements } from "../minElements";

type ApplyLengthEqual<
	GenericOutput extends readonly unknown[],
	GenericSource extends readonly unknown[],
	GenericReapplyConstraint extends "maxElements" | "minElements" | "lengthEqual",
> = "lengthEqual" extends GenericReapplyConstraint
	? DCommon.Or<[
		DCommon.ContainExtends<GenericSource, LengthEqual<number>>,
		DCommon.Not<DCommon.IsExtends<GenericOutput, DCommon.AnyTuple>>,
	]> extends true
		? ExtractLengthEqual<GenericSource, unknown> extends LengthEqual<infer InferredLength>
			? (
				& GenericOutput
				& DCommon.UnionToIntersection<
					InferredLength extends number
						? LengthEqual<InferredLength>
						: never
				>
			)
			: GenericOutput
		: GenericOutput
	: GenericOutput;

type ApplyMinElements<
	GenericOutput extends readonly unknown[],
	GenericSource extends readonly unknown[],
	GenericReapplyConstraint extends "maxElements" | "minElements" | "lengthEqual",
> = "minElements" extends GenericReapplyConstraint
	? DCommon.Or<[
		DCommon.ContainExtends<GenericSource, MinElements<number>>,
		DCommon.And<[
			DCommon.Not<DCommon.ContainExtends<GenericOutput, LengthEqual<number>>>,
			DCommon.Not<DCommon.IsExtends<GenericOutput, DCommon.AnyTuple>>,
		]>,
	]> extends true
		? ExtractMinElements<GenericSource, unknown> extends MinElements<infer InferredMin>
			? (
				& GenericOutput
				& DCommon.UnionToIntersection<
					InferredMin extends number
						? MinElements<InferredMin>
						: never
				>
			)
			: GenericOutput
		: GenericOutput
	: GenericOutput;

type ApplyMaxElements<
	GenericOutput extends readonly unknown[],
	GenericSource extends readonly unknown[],
	GenericReapplyConstraint extends "maxElements" | "minElements" | "lengthEqual",
> = "maxElements" extends GenericReapplyConstraint
	? DCommon.Or<[
		DCommon.ContainExtends<GenericSource, MaxElements<number>>,
		DCommon.And<[
			DCommon.Not<DCommon.ContainExtends<GenericOutput, LengthEqual<number>>>,
			DCommon.Not<DCommon.IsExtends<GenericOutput, DCommon.AnyTuple>>,
		]>,
	]> extends true
		? ExtractMaxElements<GenericSource, unknown> extends MaxElements<infer InferredMax>
			? (
				& GenericOutput
				& DCommon.UnionToIntersection<
					InferredMax extends number
						? MaxElements<InferredMax>
						: never
				>
			)
			: GenericOutput
		: GenericOutput
	: GenericOutput;

export type ReapplyCompatiblesConstraints<
	GenericSource extends readonly unknown[],
	GenericOutput extends readonly unknown[],
	GenericReapplyConstraint extends "maxElements" | "minElements" | "lengthEqual" = "maxElements" | "minElements" | "lengthEqual",
> = ApplyMaxElements<
	ApplyMinElements<
		ApplyLengthEqual<
			GenericOutput,
			GenericSource,
			GenericReapplyConstraint
		>,
		GenericSource,
		GenericReapplyConstraint
	>,
	GenericSource,
	GenericReapplyConstraint
>;
