import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const numberLiteralTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/number-literal-type", unknown>>;
export interface NumberLiteralTypeDefinition extends TypeDefinition {
    value: number;
}
export interface NumberLiteralType<GenericValue extends number = number> extends DCommon.Forward<Type<FundamentalType.TheNumber, GenericValue, NumberLiteralTypeDefinition> & DKind.Kind<typeof numberLiteralTypeKind>> {
}
export declare const NumberLiteralType: <const GenericNumber extends number>(value: GenericNumber) => NumberLiteralType<GenericNumber>;
