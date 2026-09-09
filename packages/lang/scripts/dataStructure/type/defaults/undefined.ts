import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const undefinedTypeKind = createKind("undefined-type");

export interface UndefinedTypeDefinition extends TypeDefinition {}

export interface UndefinedType extends DCommon.Forward<
	& Type<
		FundamentalType.TheUndefined,
		undefined,
		UndefinedTypeDefinition
	>
	& DKind.Kind<typeof undefinedTypeKind>
> {

}

export const UndefinedType = createType(
	FundamentalType.TheUndefined,
	undefinedTypeKind,
	({ init }) => () => init<UndefinedType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
