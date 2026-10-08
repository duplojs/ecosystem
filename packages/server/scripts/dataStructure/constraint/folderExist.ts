import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DEither from "@duplojs/lang/either";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from "@scripts/file";
import { createKind } from "../kind";

export const folderExistConstraintKind = createKind("folder-exist-constraint");

export interface FolderExistConstraintDefinition extends DDataStructure.ConstraintDefinition {
}

export interface FolderExistConstraint extends DCommon.UnionToIntersection<
	& DDataStructure.Constraint<
		DSFile.FolderInterface,
		DSFile.FolderInterface,
		FolderExistConstraintDefinition
	>
	& DKind.Kind<typeof folderExistConstraintKind>
> {}

export const FolderExistConstraint = DDataStructure.createConstraint(
	folderExistConstraintKind,
	({ init }) => () => init<FolderExistConstraint>(
		{ },
		{
			executeCheck: async(_self, data) => {
				const result = DEither.rightPipe(
					await data.stat(),
					(stat) => stat.isDirectory
						? stat
						: DEither.fail(),
				);

				if (DEither.isLeft(result)) {
					return DDataStructure.ErrorSymbol;
				}

				return DDataStructure.SuccessSymbol;
			},
			isAsynchronous: () => true,
		},
	),
);
