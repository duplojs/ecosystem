import type * as DString from "@scripts/string";
import type * as DCommon from "@scripts/common";
import type * as DPath from "@scripts/path";
import { type CastError } from "./error";
import { type CompatibilityConstraintResult, type BaseConstraint } from "../types";

export interface ComputeCastConstraintStringRule<
	GenericValue extends string,
	GenericExpectedConstraint extends BaseConstraint,
> {
	maxCharacters: GenericExpectedConstraint extends DString.MaxCharacters<number>
		? DCommon.NeverCoalescing<
			| (
				DString.ComputeMaxCharactersCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DString.ExtractLengthEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on MaxCharacters<${InferredResult["to"]}> because constraint MaxCharacters<${InferredResult["from"]}> from the value is more than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on MaxCharacters<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is more than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on MaxCharacters because value does not have MaxCharacters constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	minCharacters: GenericExpectedConstraint extends DString.MinCharacters<number>
		? DCommon.NeverCoalescing<
			| (
				DString.ComputeMinCharactersCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DString.ExtractLengthEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on MinCharacters<${InferredResult["to"]}> because constraint MinCharacters<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on MinCharacters<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on MinCharacters because value does not have MinCharacters constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	lengthEqual: GenericExpectedConstraint extends DString.LengthEqual<number>
		? DCommon.NeverCoalescing<
			| (
				DString.ComputeLengthEqualCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: CastError<
							`Impossible to cast on LengthEqual<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is not equal.`,
							GenericValue,
							GenericExpectedConstraint
						>
					: never
			),
			CastError<
				"Impossible to cast on LengthEqual because value does not have LengthEqual constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	allowedCharacters: GenericExpectedConstraint extends DString.AllowedCharacters<infer InferredCharactersRange>
		? DCommon.Or<[
			DString.IsAllowedString<
				Extract<DCommon.RemoveConstraint<GenericValue>, string>,
				DString.CharactersRangeStore[InferredCharactersRange]
			>,
			DCommon.IsExtends<GenericValue, GenericExpectedConstraint>,
		]> extends true
			? unknown
			: CastError<
					`Impossible to cast on AllowedCharacters because value ${GenericValue} contains forbidden characters.`,
					GenericValue,
					GenericExpectedConstraint
			>
		: never;
	number: DCommon.IsExtends<GenericExpectedConstraint, DString.Number> extends true
		? DCommon.Or<[
			DCommon.IsExtends<GenericValue, DString.NumberInString>,
			DCommon.IsExtends<GenericValue, DString.Number>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on Number because value ${GenericValue} is not a number.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
	path: DCommon.IsExtends<GenericExpectedConstraint, DPath.Path> extends true
		? DCommon.Or<[
			DPath.IsLiteralPath<GenericValue>,
			DCommon.IsExtends<GenericValue, DPath.Path | DPath.Absolute | DPath.Segment>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on Path because value ${GenericValue} is not path.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
	absolutePath: DCommon.IsExtends<GenericExpectedConstraint, DPath.Absolute> extends true
		? DCommon.Or<[
			DPath.IsLiteralAbsolutePath<GenericValue>,
			DCommon.IsExtends<GenericValue, DPath.Absolute>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on AbsolutePath because value ${GenericValue} is not absolute path.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
	segment: DCommon.IsExtends<GenericExpectedConstraint, DPath.Segment> extends true
		? DCommon.Or<[
			DPath.IsLiteralSegmentPath<GenericValue>,
			DCommon.IsExtends<GenericValue, DPath.Segment>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on SegmentPath because value ${GenericValue} is not segment path.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
}
