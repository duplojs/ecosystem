import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const bigintTypeKind = createKind("bigint-type");

export interface BigintTypeDefinition extends TypeDefinition {}

export interface BigintType extends DCommon.Forward<
	& Type<
		FundamentalType.TheBigint,
		bigint,
		BigintTypeDefinition
	>
	& DKind.Kind<typeof bigintTypeKind>
> {

}

export const BigintType = createType(
	FundamentalType.TheBigint,
	bigintTypeKind,
	({ init }) => () => init<BigintType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
