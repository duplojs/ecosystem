import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DChrono from "@scripts/chrono";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const timeTypeKind = createKind("time-type");

export interface TimeTypeDefinition extends TypeDefinition {}

export interface TimeType extends DCommon.Forward<
	& Type<
		FundamentalType.TheTime,
		DChrono.TheTime,
		TimeTypeDefinition
	>
	& DKind.Kind<typeof timeTypeKind>
> {

}

export const TimeType = createType(
	FundamentalType.TheTime,
	timeTypeKind,
	({ init }) => () => init<TimeType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
