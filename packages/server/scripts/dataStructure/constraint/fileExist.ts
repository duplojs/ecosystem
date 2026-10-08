import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DEither from "@duplojs/lang/either";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from "@scripts/file";
import { createKind } from "../kind";

export const fileExistConstraintKind = createKind("file-exist-constraint");

export interface FileExistConstraintDefinition extends DDataStructure.ConstraintDefinition {
}

export interface FileExistConstraint extends DCommon.UnionToIntersection<
	& DDataStructure.Constraint<
		DSFile.FileInterface,
		DSFile.FileInterface,
		FileExistConstraintDefinition
	>
	& DKind.Kind<typeof fileExistConstraintKind>
> {}

export const FileExistConstraint = DDataStructure.createConstraint(
	fileExistConstraintKind,
	({ init }) => () => init<FileExistConstraint>(
		{ },
		{
			executeCheck: async(_self, data) => {
				const result = DEither.rightPipe(
					await data.stat(),
					(stat) => stat.isFile
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
