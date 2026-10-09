import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DSFile from '../../file';
import * as FundamentalType from "../fundamentalType";
export declare const fileTypeKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/file-type", unknown>>;
export interface TimeTypeDefinition extends DDataStructure.TypeDefinition {
}
export interface FileType extends DCommon.UnionToIntersection<DDataStructure.Type<FundamentalType.TheFile, DSFile.FileInterface, TimeTypeDefinition> & DKind.Kind<typeof fileTypeKind>> {
}
export declare const FileType: () => FileType;
