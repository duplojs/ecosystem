import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from "@scripts/file";
import * as FundamentalType from "../fundamentalType";
import { createKind } from "../kind";

export const folderTypeKind = createKind("folder-type");

export interface FolderTypeDefinition extends DDataStructure.TypeDefinition {}

export interface FolderType extends DCommon.UnionToIntersection<
	& DDataStructure.Type<
		FundamentalType.TheFolder,
		DSFile.FolderInterface,
		FolderTypeDefinition
	>
	& DKind.Kind<typeof folderTypeKind>
> {

}

export const FolderType = DDataStructure.createType(
	FundamentalType.TheFolder,
	folderTypeKind,
	({ init }) => () => init<FolderType>(
		{},
		{
			executeCheck: () => DDataStructure.SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
