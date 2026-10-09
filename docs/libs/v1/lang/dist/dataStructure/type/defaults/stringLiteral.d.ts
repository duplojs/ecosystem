import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const stringLiteralTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/string-literal-type", unknown>>;
export interface StringLiteralTypeDefinition extends TypeDefinition {
    value: string;
}
export interface StringLiteralType<GenericValue extends string = string> extends DCommon.Forward<Type<FundamentalType.TheString, GenericValue, StringLiteralTypeDefinition> & DKind.Kind<typeof stringLiteralTypeKind>> {
}
export declare const StringLiteralType: <const GenericString extends string>(value: GenericString) => StringLiteralType<GenericString>;
