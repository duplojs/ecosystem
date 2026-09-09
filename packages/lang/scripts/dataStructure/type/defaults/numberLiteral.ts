import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const numberLiteralTypeKind = createKind("number-literal-type");

export interface NumberLiteralTypeDefinition extends TypeDefinition {
	value: number;
}

export interface NumberLiteralType<
	GenericValue extends number = number,
> extends DCommon.Forward<
	& Type<
		FundamentalType.TheNumber,
		GenericValue,
		NumberLiteralTypeDefinition
	>
	& DKind.Kind<typeof numberLiteralTypeKind>
	> {

}

export const NumberLiteralType = createType(
	FundamentalType.TheNumber,
	numberLiteralTypeKind,
	({ init }) => <
		const GenericNumber extends number,
	>(value: GenericNumber) => init<NumberLiteralType<GenericNumber>>(
		{ value },
		{
			executeCheck: (self, data) => data === self.definition.value
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
