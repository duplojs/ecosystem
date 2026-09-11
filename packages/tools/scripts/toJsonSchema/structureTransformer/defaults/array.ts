import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import type { JsonSchema } from "../../result";
import { createStructureTransformer } from "../create";

export interface JsonSchemaArray {
	type: "array";
	items: JsonSchema;
	minItems?: number;
	maxItems?: number;
	allOf?: readonly Omit<JsonSchemaArray, "type" | "items" | "allOf">[];
}

export const arrayStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.arrayStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const elementResult = transformer(structure.definition.element);

		if (DEither.isLeft(elementResult)) {
			return elementResult;
		}

		return DCommon.pipe(
			structure.definition.constraints,
			DArray.reduce(
				DArray.reduceFrom<JsonSchemaArray>({
					type: "array",
					items: DEither.unwrapRight(elementResult),
				}),
				({
					element: constraint,
					lastValue,
					nextWithObject,
					next,
				}) => DPattern.match(constraint)
					.when(
						DDataStructure.constraintIdentifier(
							DDataStructure.minElementsConstraintKind,
						),
						({ definition }) => nextWithObject(
							lastValue,
							lastValue.minItems !== undefined
								? {
									allOf: [
										...(lastValue.allOf ?? []),
										{ minItems: definition.min },
									],
								}
								: { minItems: definition.min },
						),
					)
					.when(
						DDataStructure.constraintIdentifier(
							DDataStructure.maxElementsConstraintKind,
						),
						({ definition }) => nextWithObject(
							lastValue,
							lastValue.maxItems !== undefined
								? {
									allOf: [
										...(lastValue.allOf ?? []),
										{ maxItems: definition.max },
									],
								}
								: { maxItems: definition.max },
						),
					)
					.when(
						DDataStructure.constraintIdentifier(
							DDataStructure.arrayLengthEqualConstraintKind,
						),
						({ definition }) => nextWithObject(
							lastValue,
							lastValue.minItems !== undefined || lastValue.maxItems !== undefined
								? {
									allOf: [
										...(lastValue.allOf ?? []),
										{
											minItems: definition.length,
											maxItems: definition.length,
										},
									],
								}
								: {
									minItems: definition.length,
									maxItems: definition.length,
								},
						),
					)
					.otherwise(() => next(lastValue)),
			),
			success,
		);
	},
);
