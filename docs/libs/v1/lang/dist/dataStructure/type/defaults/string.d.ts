import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const stringTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/string-type", unknown>>;
export interface StringTypeDefinition extends TypeDefinition {
}
export interface StringType extends DCommon.Forward<Type<FundamentalType.TheString, string, StringTypeDefinition> & DKind.Kind<typeof stringTypeKind>> {
}
export declare const StringType: () => StringType;
