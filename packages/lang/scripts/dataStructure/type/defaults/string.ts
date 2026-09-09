import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const stringTypeKind = createKind("string-type");

export interface StringTypeDefinition extends TypeDefinition {}

export interface StringType extends DCommon.Forward<
	& Type<
		FundamentalType.TheString,
		string,
		StringTypeDefinition
	>
	& DKind.Kind<typeof stringTypeKind>
> {

}

export const StringType = createType(
	FundamentalType.TheString,
	stringTypeKind,
	({ init }) => () => init<StringType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
