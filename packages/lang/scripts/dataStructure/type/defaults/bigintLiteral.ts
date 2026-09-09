import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const bigintLiteralTypeKind = createKind("bigint-literal-type");

export interface BigintLiteralTypeDefinition extends TypeDefinition {
	value: bigint;
}

export interface BigintLiteralType<
	GenericValue extends bigint = bigint,
> extends DCommon.Forward<
	& Type<
		FundamentalType.TheBigint,
		GenericValue,
		BigintLiteralTypeDefinition
	>
	& DKind.Kind<typeof bigintLiteralTypeKind>
	> {

}

export const BigintLiteralType = createType(
	FundamentalType.TheBigint,
	bigintLiteralTypeKind,
	({ init }) => <
		const GenericBigint extends bigint,
	>(value: GenericBigint) => init<BigintLiteralType<GenericBigint>>(
		{ value },
		{
			executeCheck: (self, data) => data === self.definition.value
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
