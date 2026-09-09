import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";
import type * as DTuple from "@scripts/tuple";

// oxlint-disable @stylistic/quote-props
interface FigureGreaterThanTable {
	"0": ["0", "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"];
	"1": ["1", "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"];
	"2": ["2", "3" | "4" | "5" | "6" | "7" | "8" | "9"];
	"3": ["3", "4" | "5" | "6" | "7" | "8" | "9"];
	"4": ["4", "5" | "6" | "7" | "8" | "9"];
	"5": ["5", "6" | "7" | "8" | "9"];
	"6": ["6", "7" | "8" | "9"];
	"7": ["7", "8" | "9"];
	"8": ["8", "9"];
	"9": ["9", ""];
}

type FigureGreaterThanTableValue = FigureGreaterThanTable[keyof FigureGreaterThanTable];

type CreateGreaterThanTable<
	GenericSplitReference extends DCommon.AnyTuple<DString.Digit>,
> = GenericSplitReference extends readonly [
	infer InferredFirst extends DString.Digit,
	...infer InferredRest,
]
	? InferredRest extends readonly []
		? readonly [FigureGreaterThanTable[InferredFirst]]
		: CreateGreaterThanTable<
			Extract<
				InferredRest,
				DCommon.AnyTuple<DString.Digit>
			>
		> extends infer InferredRestResult extends DCommon.AnyTuple<FigureGreaterThanTableValue>
			? readonly [FigureGreaterThanTable[InferredFirst], ...InferredRestResult]
			: never
	: never;

type CheckIsGreater<
	GreaterSplitValue extends DCommon.AnyTuple<DString.Digit>,
	GreaterTableReference extends DCommon.AnyTuple<FigureGreaterThanTableValue>,
> = GreaterSplitValue[0] extends GreaterTableReference[0][1]
	? true
	: DCommon.IsEqual<GreaterSplitValue[0], GreaterTableReference[0][0]> extends true
		? DCommon.IsEqual<GreaterSplitValue["length"], 1> extends true
			? false
			: readonly [
				DTuple.Shift<GreaterSplitValue>,
				DTuple.Shift<GreaterTableReference>,
			] extends readonly [
				infer InferredRestSplitValue extends DCommon.AnyTuple<DString.Digit>,
				infer InferredRestSplitReference extends DCommon.AnyTuple<FigureGreaterThanTableValue>,
			]
				? CheckIsGreater<InferredRestSplitValue, InferredRestSplitReference>
				: never
		: false;

type toStringDecimal<
	GenericValue extends number,
> = `${GenericValue}` extends `${DString.NumberInString}.${DString.NumberInString}`
	? `${GenericValue}`
	: `${GenericValue}.0`;

type PrepareValues<
	GenericValue extends number,
	GenericReference extends number,
> = readonly [
	toStringDecimal<GenericValue>,
	toStringDecimal<GenericReference>,
] extends readonly [
	`${infer InferredValueInteger extends DString.NumberInString}.${infer InferredValueDecimals extends DString.NumberInString}`,
	`${infer InferredReferenceInteger extends DString.NumberInString}.${infer InferredReferenceDecimals extends DString.NumberInString}`,
]
	? DCommon.And<[
		DCommon.IsEqual<InferredValueDecimals, "0">,
		DCommon.IsEqual<InferredReferenceDecimals, "0">,
	]> extends true
		? readonly [InferredValueInteger, InferredReferenceInteger]
		: DCommon.IsEqual<
			InferredValueInteger,
			InferredReferenceInteger
		> extends true
			? readonly [
				DString.Split<InferredValueDecimals, "">,
				DString.Split<InferredReferenceDecimals, "">,
			] extends readonly [
				infer InferredSplitValue extends DCommon.AnyTuple<DString.Digit>,
				infer InferredSplitReference extends DCommon.AnyTuple<DString.Digit>,
			]
				? (
					DCommon.IsEqual<InferredSplitValue["length"], InferredSplitReference["length"]> extends true
						? readonly [
							DTuple.Join<InferredSplitValue, "">,
							DTuple.Join<InferredSplitReference, "">,
						]
						: (
							DTuple.Create<any, InferredSplitValue["length"]> extends readonly [...DTuple.Create<any, InferredSplitReference["length"]>, ...any[]]
								? InferredSplitValue["length"]
								: InferredSplitReference["length"]
						) extends infer InferredLength extends number
							? readonly [
								DTuple.Join<
									Extract<
										DCommon.IsEqual<InferredLength, InferredSplitValue["length"]> extends true
											? InferredSplitValue
											: DTuple.Create<"0", InferredLength, InferredSplitValue>,
										DCommon.AnyTuple<string>
									>,
									""
								>,
								DTuple.Join<
									Extract<
										DCommon.IsEqual<InferredLength, InferredSplitReference["length"]> extends true
											? InferredSplitReference
											: DTuple.Create<"0", InferredLength, InferredSplitReference>,
										DCommon.AnyTuple<string>
									>,
									""
								>,
							]
							: never
				) extends readonly [
					`${infer InferredResultValue}`,
					`${infer InferredResultReference}`,
				]
					? readonly [`${InferredResultValue}`, `${InferredResultReference}`]
					: never
				: never
			: readonly [InferredValueInteger, InferredReferenceInteger]
	: never;

type ComputeIsGreater<
	GenericValue extends number,
	GenericReference extends number,
> = PrepareValues<
	GenericValue,
	GenericReference
> extends readonly [
	infer InferredValue extends DString.NumberInString,
	infer InferredReference extends DString.NumberInString,
]
	? DCommon.And<[
		DString.Includes<InferredValue, "-">,
		DCommon.Not<DString.Includes<InferredReference, "-">>,
	]> extends true
		? false
		: DCommon.And<[
			DCommon.Not<DString.Includes<InferredValue, "-">>,
			DString.Includes<InferredReference, "-">,
		]> extends true
			? true
			: (
				[
					DString.Split<DString.Replace<InferredValue, "-", "">, "">,
					DString.Split<DString.Replace<InferredReference, "-", "">, "">,
				] extends readonly [
					infer InferredSplitValue extends DCommon.AnyTuple<DString.Digit>,
					infer InferredSplitReference extends DCommon.AnyTuple<DString.Digit>,
				]
					? DCommon.IsEqual<InferredSplitValue["length"], InferredSplitReference["length"]> extends true
						? CheckIsGreater<
							InferredSplitValue,
							CreateGreaterThanTable<InferredSplitReference>
						>
						: DTuple.Create<0, InferredSplitValue["length"]> extends readonly [
							...DTuple.Create<0, InferredSplitReference["length"]>,
							...0[],
						]
							? true
							: false
					: never
			) extends infer InferredResult extends boolean
				? DString.Includes<InferredValue, "-"> extends true
					? DCommon.Not<InferredResult>
					: InferredResult
				: never
	: never;

export type IsGreaterOrEqual<
	GenericValue extends number,
	GenericReference extends number,
> = DCommon.IsEqual<GenericValue, GenericReference> extends true
	? true
	: ComputeIsGreater<GenericValue, GenericReference>;

export type IsGreater<
	GenericValue extends number,
	GenericReference extends number,
> = DCommon.Not<DCommon.IsEqual<GenericValue, GenericReference>> extends true
	? ComputeIsGreater<GenericValue, GenericReference>
	: false;
