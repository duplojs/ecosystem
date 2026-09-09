import type * as DCommon from "@scripts/common";
import { type Constraint } from "../constraint";
import { type Structure, TypeStructure, type UnionStructure } from "../structure";
import { BigintLiteralType, BooleanLiteralType, NullType, NumberLiteralType, StringLiteralType, UndefinedType } from "../type";
import { union } from "./union";

export type LiteralValue = string | number | bigint | boolean | undefined | null;

export function literal<
	const GenericValue extends LiteralValue | DCommon.AnyTuple<LiteralValue>,
	const GenericConstraints extends readonly Constraint<
		GenericValue extends readonly unknown[]
			? GenericValue[number]
			: GenericValue
	>[] = readonly [],
>(
	values: GenericValue,
	constraints?: GenericConstraints,
): GenericValue extends readonly unknown[]
	? UnionStructure<
		GenericValue[number],
		GenericConstraints
	>
	: TypeStructure<
		GenericValue,
		Extract<GenericConstraints, readonly Constraint<GenericValue>[]>
	>;

export function literal(
	values: LiteralValue | LiteralValue[],
	constraints: readonly Constraint<any>[] = [],
): any {
	if (values instanceof Array) {
		return union(
			values.map<Structure>((value) => literal(value)) as never,
			constraints as never,
		);
	}

	if (typeof values === "string") {
		return TypeStructure(StringLiteralType(values), constraints);
	}

	if (typeof values === "number") {
		return TypeStructure(NumberLiteralType(values), constraints);
	}

	if (typeof values === "bigint") {
		return TypeStructure(BigintLiteralType(values), constraints);
	}

	if (typeof values === "boolean") {
		return TypeStructure(BooleanLiteralType(values), constraints);
	}

	if (values === undefined) {
		return TypeStructure(UndefinedType(), constraints);
	}

	type _check = DCommon.ExpectType<
		typeof values,
		null,
		"strict"
	>;

	return TypeStructure(NullType(), constraints);
}
