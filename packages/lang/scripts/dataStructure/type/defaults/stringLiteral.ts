import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const stringLiteralTypeKind = createKind("string-literal-type");

export interface StringLiteralTypeDefinition extends TypeDefinition {
	value: string;
}

export interface StringLiteralType<
	GenericValue extends string = string,
> extends DCommon.Forward<
	& Type<
		FundamentalType.TheString,
		GenericValue,
		StringLiteralTypeDefinition
	>
	& DKind.Kind<typeof stringLiteralTypeKind>
	> {

}

export const StringLiteralType = createType(
	FundamentalType.TheString,
	stringLiteralTypeKind,
	({ init }) => <
		const GenericString extends string,
	>(value: GenericString) => init<StringLiteralType<GenericString>>(
		{ value },
		{
			executeCheck: (self, data) => data === self.definition.value
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
