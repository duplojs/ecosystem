import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type * as DTuple from "@scripts/tuple";
import type { AllowedCharacters, CharactersRange, IsIndexCovered, IsIndexOutOfRange, LengthEqual } from "../constraints";
import type { IsLiteral } from "./isLiteral";
import type { Split } from "./split";

type ReverseCharacters<
	GenericCharacters extends readonly string[],
> = GenericCharacters extends DCommon.AnyTuple<string>
	? DTuple.Reverse<GenericCharacters>
	: GenericCharacters;

type LiteralAt<
	GenericString extends string,
	GenericIndex extends number,
> = DCommon.IsEqual<GenericString, ""> extends true
	? undefined
	: Split<
		Extract<
			DCommon.RemoveConstraint<GenericString>,
			string
		>,
		""
	> extends infer InferredCharacters extends readonly string[]
		? DCommon.IsEqual<GenericIndex, number> extends true
			? InferredCharacters[number] | undefined
			: DNumber.IsNegative<GenericIndex> extends true
				? DTuple.At<
					readonly [
						undefined,
						...ReverseCharacters<InferredCharacters>,
					],
					DNumber.Absolute<GenericIndex>
				>
				: DTuple.At<InferredCharacters, GenericIndex>
		: never;

type CharacterOutput<
	GenericString extends string,
> = GenericString extends AllowedCharacters<infer InferredCharactersRange extends CharactersRange>
	? string & LengthEqual<1> & AllowedCharacters<InferredCharactersRange>
	: string & LengthEqual<1>;

type ConstraintAt<
	GenericString extends string,
	GenericIndex extends number,
> = IsIndexOutOfRange<GenericString, GenericIndex> extends true
	? undefined
	: IsIndexCovered<GenericString, GenericIndex> extends true
		? CharacterOutput<GenericString>
		: CharacterOutput<GenericString> | undefined;

export type At<
	GenericString extends string,
	GenericIndex extends number,
> = DCommon.RemoveConstraint<GenericString> extends infer InferredString extends string
	? IsLiteral<InferredString> extends true
		? LiteralAt<InferredString, GenericIndex>
		: ConstraintAt<GenericString, GenericIndex>
	: never;
