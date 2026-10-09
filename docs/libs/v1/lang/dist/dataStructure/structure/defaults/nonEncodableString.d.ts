import { Structure, StructureDefinition } from '../base';
import type * as DKind from '../../../kind';
import type * as DCommon from '../../../common';
export declare const nonEncodableStringStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/non-encodable-string-structure", unknown>>;
export interface NonEncodableStringStructureDefinition extends StructureDefinition<readonly []> {
    readonly value: string;
}
export interface NonEncodableStringStructure extends DCommon.Forward<Structure<String, NonEncodableStringStructureDefinition> & DKind.Kind<typeof nonEncodableStringStructureKind>> {
}
export declare const NonEncodableStringStructure: (value: string) => NoInfer<NonEncodableStringStructure>;
