import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";

export interface CharactersRangeStore {

}

export type CharactersRange = Extract<
	DObject.GetPropsWithValueExtends<CharactersRangeStore, string>,
	string
>;

export type AllowedCharactersConstraintName = "string-allowed-characters";

export interface AllowedCharacters<
	GenericCharactersRange extends CharactersRange = never,
> extends DCommon.Constraint<
		AllowedCharactersConstraintName,
		() => Partial<Record<GenericCharactersRange, GenericCharactersRange>>
	> {
}

export type ExtractAllowedCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends AllowedCharacters
	? (
		keyof ReturnType<GenericConstraint[DCommon.ConstraintSymbol][AllowedCharactersConstraintName]>
	) extends infer InferredResult extends CharactersRange
		? DCommon.UnionToIntersection<
			InferredResult extends any
				? DCommon.IsNever<InferredResult> extends true
					? AllowedCharacters
					: AllowedCharacters<InferredResult>
				: never
		>
		: GenericDefault
	: GenericDefault;
