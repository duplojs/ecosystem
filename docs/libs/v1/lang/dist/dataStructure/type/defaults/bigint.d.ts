import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const bigintTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/bigint-type", unknown>>;
export interface BigintTypeDefinition extends TypeDefinition {
}
export interface BigintType extends DCommon.Forward<Type<FundamentalType.TheBigint, bigint, BigintTypeDefinition> & DKind.Kind<typeof bigintTypeKind>> {
}
export declare const BigintType: () => BigintType;
