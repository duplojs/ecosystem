import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { createStructureTransformer } from "../create";

export const typeStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.typeStructureKind,
	),
	(
		structure,
		{
			transformType,
			buildError,
		},
	) => DCommon.pipe(
		structure.definition.type,
		transformType,
		DCommon.when(
			DEither.isLeft,
			() => buildError(),
		),
	),
);
