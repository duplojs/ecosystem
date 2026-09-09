import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DChrono from "@scripts/chrono";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const dateTypeKind = createKind("date-type");

export interface DateTypeDefinition extends TypeDefinition {}

export interface DateType extends DCommon.Forward<
	& Type<
		FundamentalType.TheDate,
		DChrono.TheDate,
		DateTypeDefinition
	>
	& DKind.Kind<typeof dateTypeKind>
> {

}

export const DateType = createType(
	FundamentalType.TheDate,
	dateTypeKind,
	({ init }) => () => init<DateType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
