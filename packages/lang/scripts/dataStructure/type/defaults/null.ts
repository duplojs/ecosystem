import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const nullTypeKind = createKind("null-type");

export interface NullTypeDefinition extends TypeDefinition {}

export interface NullType extends DCommon.Forward<
	& Type<
		FundamentalType.TheNull,
		null,
		NullTypeDefinition
	>
	& DKind.Kind<typeof nullTypeKind>
> {

}

export const NullType = createType(
	FundamentalType.TheNull,
	nullTypeKind,
	({ init }) => () => init<NullType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
