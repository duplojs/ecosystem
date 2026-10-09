import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const nullTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/null-type", unknown>>;
export interface NullTypeDefinition extends TypeDefinition {
}
export interface NullType extends DCommon.Forward<Type<FundamentalType.TheNull, null, NullTypeDefinition> & DKind.Kind<typeof nullTypeKind>> {
}
export declare const NullType: () => NullType;
