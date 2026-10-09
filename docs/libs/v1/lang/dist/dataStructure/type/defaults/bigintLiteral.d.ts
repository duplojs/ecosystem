import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const bigintLiteralTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/bigint-literal-type", unknown>>;
export interface BigintLiteralTypeDefinition extends TypeDefinition {
    value: bigint;
}
export interface BigintLiteralType<GenericValue extends bigint = bigint> extends DCommon.Forward<Type<FundamentalType.TheBigint, GenericValue, BigintLiteralTypeDefinition> & DKind.Kind<typeof bigintLiteralTypeKind>> {
}
export declare const BigintLiteralType: <const GenericBigint extends bigint>(value: GenericBigint) => BigintLiteralType<GenericBigint>;
