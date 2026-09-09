import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";
import type * as DPath from "@scripts/path";

export interface ComputeInferConstraintStringRule<
	GenericInput extends string,
	GenericOutput extends unknown,
> {
	maxCharacters: DString.ComputeMaxCharactersCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DString.MaxCharacters<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on MaxCharacters<${InferredResult["to"]}> because constraint MaxCharacters<${InferredResult["from"]}> from the value is more than.`>
		: never;
	minCharacters: DString.ComputeMinCharactersCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DString.MinCharacters<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on MinCharacters<${InferredResult["to"]}> because constraint MinCharacters<${InferredResult["from"]}> from the value is less than.`>
		: never;
	lengthEqual: DString.ComputeLengthEqualCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DString.LengthEqual<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on LengthEqual<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is not equal.`>
		: never;
	allowedCharacters: GenericOutput extends DString.AllowedCharacters<infer InferredCharactersRange>
		? DString.IsAllowedString<
			GenericInput,
			DString.CharactersRangeStore[InferredCharactersRange]
		> extends true
			? DString.AllowedCharacters<InferredCharactersRange>
			: DCommon.ComputedTypeError<`Impossible to cast on AllowedCharacters because value ${GenericInput} contains forbidden characters.`>
		: never;
	number: DCommon.IsExtends<GenericOutput, DString.Number> extends true
		? GenericInput extends DString.NumberInString
			? DString.Number
			: DCommon.ComputedTypeError<`Impossible to cast on Number because value ${GenericInput} is not a number.`>
		: never;
	path: DCommon.IsExtends<GenericOutput, DPath.Path> extends true
		? DPath.IsLiteralPath<GenericInput> extends true
			? DPath.Path
			: DCommon.ComputedTypeError<`Impossible to cast on Path because value ${GenericInput} is not path.`>
		: never;
	absolutePath: DCommon.IsExtends<GenericOutput, DPath.Absolute> extends true
		? DPath.IsLiteralAbsolutePath<GenericInput> extends true
			? DPath.Absolute
			: DCommon.ComputedTypeError<`Impossible to cast on AbsolutePath because value ${GenericInput} is not absolute path.`>
		: never;
	segment: DCommon.IsExtends<GenericOutput, DPath.Segment> extends true
		? DPath.IsLiteralSegmentPath<GenericInput> extends true
			? DPath.Segment
			: DCommon.ComputedTypeError<`Impossible to cast on SegmentPath because value ${GenericInput} is not segment path.`>
		: never;
}
