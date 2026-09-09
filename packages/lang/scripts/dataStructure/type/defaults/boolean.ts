import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const booleanTypeKind = createKind("boolean-type");

export interface BooleanTypeDefinition extends TypeDefinition {}

export interface BooleanType extends DCommon.Forward<
	& Type<
		FundamentalType.TheBoolean,
		boolean,
		BooleanTypeDefinition
	>
	& DKind.Kind<typeof booleanTypeKind>
> {

}

export const BooleanType = createType(
	FundamentalType.TheBoolean,
	booleanTypeKind,
	({ init }) => () => init<BooleanType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
