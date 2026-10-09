import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const booleanLiteralTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/boolean-literal-type", unknown>>;
export interface BooleanLiteralTypeDefinition extends TypeDefinition {
    value: boolean;
}
export interface BooleanLiteralType<GenericValue extends boolean = boolean> extends DCommon.Forward<Type<FundamentalType.TheBoolean, GenericValue, BooleanLiteralTypeDefinition> & DKind.Kind<typeof booleanLiteralTypeKind>> {
}
export declare const BooleanLiteralType: <const GenericBoolean extends boolean>(value: GenericBoolean) => BooleanLiteralType<GenericBoolean>;
