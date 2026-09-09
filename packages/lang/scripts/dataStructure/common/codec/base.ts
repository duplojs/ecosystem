import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import { type FundamentalTypeValue, type FundamentalType } from "../../fundamentalType";
import { createKind } from "../../kind";
import { type GetErrorHandler } from "../error";
import { ErrorSymbol } from "../resultSymbol";

export const codecKind = createKind("codec");

export interface Codec<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericEncodedValue extends unknown = unknown,
> extends DKind.Kind<typeof codecKind> {
	readonly fundamentalType: GenericFundamentalType;
	predicateEncode(
		input: unknown,
	): input is GenericEncodedValue;
	encode(
		data: FundamentalTypeValue<GenericFundamentalType>,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| GenericEncodedValue
		| ErrorSymbol
	>;
	decode(
		data: GenericEncodedValue,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| FundamentalTypeValue<GenericFundamentalType>
		| ErrorSymbol
	>;
}

export type CodecContext = Map<FundamentalType, Codec>;

export const codecsKind = createKind("codecs");

export interface Codecs<
	GenericCodecMapper extends Record<string, Codec> = Record<string, Codec>,
> extends DKind.Kind<typeof codecsKind> {
	readonly definition: GenericCodecMapper;
	readonly context: DCommon.Memoized<CodecContext>;
}

export function createCodec<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericEncodedValue extends unknown = unknown,
>(
	fundamentalType: GenericFundamentalType,
	predicateEncode: (
		data: unknown,
	) => data is GenericEncodedValue,
	encode: (
		data: FundamentalTypeValue<GenericFundamentalType>,
		self: Codec<GenericFundamentalType, GenericEncodedValue>,
		errorHandler?: GetErrorHandler,
	) => DCommon.MaybePromise<
		| GenericEncodedValue
		| ErrorSymbol
	>,
	decode: (
		data: GenericEncodedValue,
		self: Codec<
			GenericFundamentalType,
			GenericEncodedValue
		>,
		errorHandler?: GetErrorHandler,
	) => DCommon.MaybePromise<
		| FundamentalTypeValue<GenericFundamentalType>
		| ErrorSymbol
	>,
): Codec<
	GenericFundamentalType,
	GenericEncodedValue
> {
	const self: DKind.Remove<Codec> = {
		fundamentalType,
		predicateEncode: (
			data,
		) => predicateEncode(data),
		encode: (
			data,
			errorHandler,
		) => DCommon.callThen(
			encode(data as never, self as never, errorHandler),
			(encodedData) => encodedData === ErrorSymbol
				? errorHandler?.().addEncodeIssue(self as never, "encoding", data) ?? ErrorSymbol
				: DCommon.callThen(
					predicateEncode(encodedData),
					(result) => result === false
						? errorHandler?.().addEncodeIssue(self as never, "predicate", encodedData) ?? ErrorSymbol
						: encodedData,
				),
		),
		decode: (
			data,
			errorHandler,
		) => DCommon.callThen(
			predicateEncode(data),
			(result) => result === false
				? errorHandler?.().addDecodeIssue(self as never, "predicate", data) ?? ErrorSymbol
				: DCommon.callThen(
					decode(data as never, self as never, errorHandler),
					(decodedData) => decodedData === ErrorSymbol
						? errorHandler?.().addDecodeIssue(self as never, "decoding", data) ?? ErrorSymbol
						: decodedData,
				),
		),
		[codecKind.runTimeKey]: null,
	};

	return self as never;
}

type ForbiddenDuplicateFundamentalType<
	GenericDefinition extends Record<string, Codec>,
> = {
	[Prop in keyof GenericDefinition]: [GenericDefinition[Prop]]
}[keyof GenericDefinition] extends infer InferredResult extends [unknown]
	? DCommon.IsEqual<DCommon.RemoveDuplicateInUnion<InferredResult>, InferredResult> extends true
		? unknown
		: DCommon.ComputedTypeError<"Several codecs use the same fundamental type.">
	: never;

export function createCodecs<
	GenericDefinition extends Record<string, Codec>,
>(
	definition: (
		& GenericDefinition
		& ForbiddenDuplicateFundamentalType<GenericDefinition>
	),
): Codecs<GenericDefinition> {
	return {
		context: DCommon.memo(
			() => new Map<FundamentalType, Codec>(
				Object.values(definition).map(
					(codec) => [codec.fundamentalType, codec],
				),
			),
		),
		definition,
		[codecsKind.runTimeKey]: null,
	} as never;
}

export interface EncodeStructure<
	GenericValue extends unknown,
	GenericCodecs extends Codecs,
> {

}

// Recursive types can be problematic here.
// When recursive types are used to create constraints,
// the encode/decode layer can break when it relies on
// patterns like this:
// V extends infer T ? T : never
// This forces type rendering and can trigger recursion issues.
// Some object manipulations and transformations can also cause problems.

type TreatValue<
	GenericEncodedStructure extends unknown,
	GenericValue extends unknown,
	GenericCodec extends Codec,
> = DCommon.IsNever<GenericEncodedStructure> extends true
	? DCommon.NeverCoalescing<
		GenericCodec extends Codec<
			infer InferredFundamentalType,
			infer InferredEncodedValue
		>
			? GenericValue extends FundamentalTypeValue<InferredFundamentalType>
				? InferredEncodedValue
				: never
			: never,
		GenericValue
	>
	: GenericEncodedStructure;

export type EncodedValue<
	GenericValue extends unknown,
	GenericCodecs extends Codecs,
> = GenericValue extends unknown
	? TreatValue<
		DObject.Values<
			EncodeStructure<
				GenericValue,
				GenericCodecs
			>
		>,
		GenericValue,
		DObject.Values<GenericCodecs["definition"]>
	>
	: never;
