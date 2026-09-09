import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const numberTypeKind = createKind("number-type");

export interface NumberTypeDefinition extends TypeDefinition {}

export interface NumberType extends DCommon.Forward<
	& Type<
		FundamentalType.TheNumber,
		number,
		NumberTypeDefinition
	>
	& DKind.Kind<typeof numberTypeKind>
> {

}

export const NumberType = createType(
	FundamentalType.TheNumber,
	numberTypeKind,
	({ init }) => () => init<NumberType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
