import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as FundamentalType from "../../fundamentalType";
export declare const numberTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/number-type", unknown>>;
export interface NumberTypeDefinition extends TypeDefinition {
}
export interface NumberType extends DCommon.Forward<Type<FundamentalType.TheNumber, number, NumberTypeDefinition> & DKind.Kind<typeof numberTypeKind>> {
}
export declare const NumberType: () => NumberType;
