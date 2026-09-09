import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const booleanLiteralTypeKind = createKind("boolean-literal-type");

export interface BooleanLiteralTypeDefinition extends TypeDefinition {
	value: boolean;
}

export interface BooleanLiteralType<
	GenericValue extends boolean = boolean,
> extends DCommon.Forward<
	& Type<
		FundamentalType.TheBoolean,
		GenericValue,
		BooleanLiteralTypeDefinition
	>
	& DKind.Kind<typeof booleanLiteralTypeKind>
	> {

}

export const BooleanLiteralType = createType(
	FundamentalType.TheBoolean,
	booleanLiteralTypeKind,
	({ init }) => <
		const GenericBoolean extends boolean,
	>(value: GenericBoolean) => init<BooleanLiteralType<GenericBoolean>>(
		{ value },
		{
			executeCheck: (self, data) => data === self.definition.value
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
