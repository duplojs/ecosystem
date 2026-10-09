import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const booleanTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/boolean-type", unknown>>;
export interface BooleanTypeDefinition extends TypeDefinition {
}
export interface BooleanType extends DCommon.Forward<Type<FundamentalType.TheBoolean, boolean, BooleanTypeDefinition> & DKind.Kind<typeof booleanTypeKind>> {
}
export declare const BooleanType: () => BooleanType;
