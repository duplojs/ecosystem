import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const undefinedTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/undefined-type", unknown>>;
export interface UndefinedTypeDefinition extends TypeDefinition {
}
export interface UndefinedType extends DCommon.Forward<Type<FundamentalType.TheUndefined, undefined, UndefinedTypeDefinition> & DKind.Kind<typeof undefinedTypeKind>> {
}
export declare const UndefinedType: () => UndefinedType;
