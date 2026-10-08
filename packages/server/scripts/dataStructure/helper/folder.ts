import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from "@scripts/file";
import { FolderType } from "../type";

export function folder<
	const GenericConstraints extends readonly DDataStructure.Constraint<DSFile.FolderInterface>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return DDataStructure.TypeStructure(
		FolderType(),
		constraints,
	);
}
