import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DArray from "@duplojs/lang/array";
import * as DTuple from "@duplojs/lang/tuple";
import * as DEither from "@duplojs/lang/either";
import { createStructureTransformer } from "../create";

export interface JsonSchemaNewType {
	title: string;
}

export const newTypeStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(DModeling.newTypeStructureKind),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const newTypeConstraints = structure.definition.newTypeConstraints;

		const innerStructure = DArray.minElements(newTypeConstraints, 1)
			? structure.definition.inner.clone().addConstraint(
				...DTuple.from(newTypeConstraints),
			)
			: structure.definition.inner.clone();

		const innerResult = transformer(innerStructure);

		if (DEither.isLeft(innerResult)) {
			return innerResult;
		}

		const innerType = DEither.unwrapRight(innerResult);

		return success(
			{
				title: structure.name,
				...innerType,
			},
		);
	},
);
