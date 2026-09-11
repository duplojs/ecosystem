import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import { createTypeTransformer } from "../create";
import type { JsonSchemaNumber } from "./number";

export interface JsonSchemaNumberLiteral extends JsonSchemaNumber {
	const: number;
}

export const numberLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.numberLiteralTypeKind),
	(
		type,
		constraints,
		{
			success,
		},
	) => DCommon.pipe(
		constraints,
		DArray.reduce(
			DArray.reduceFrom<JsonSchemaNumberLiteral>({
				type: "number",
				const: type.definition.value,
			}),
			({
				element: constraint,
				lastValue,
				nextWithObject,
				next,
			}) => DPattern.match(constraint)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.integerConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						{ type: "integer" },
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.multipleOfConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						{ multipleOf: definition.multiple },
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.negativeConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.maximum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										maximum: 0,
									},
								],
							}
							: {
								maximum: 0,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.notZeroConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						{
							anyOf: [
								...(lastValue.anyOf ?? []),
								{ exclusiveMaximum: 0 },
								{ exclusiveMinimum: 0 },
							],
						},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.positiveConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.minimum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										minimum: 0,
									},
								],
							}
							: {
								minimum: 0,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.safeConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						{
							allOf: [
								...(lastValue.allOf ?? []),
								{ maximum: Number.MAX_SAFE_INTEGER },
								{ minimum: Number.MIN_SAFE_INTEGER },
							],
						},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.strictNegativeConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.exclusiveMaximum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										exclusiveMaximum: 0,
									},
								],
							}
							: {
								exclusiveMaximum: 0,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.strictPositiveConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.exclusiveMinimum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										exclusiveMinimum: 0,
									},
								],
							}
							: {
								exclusiveMinimum: 0,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.betweenThanConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						lastValue.exclusiveMaximum || lastValue.exclusiveMinimum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										exclusiveMinimum: definition.greater,
										exclusiveMaximum: definition.less,
									},
								],
							}
							: {
								exclusiveMinimum: definition.greater,
								exclusiveMaximum: definition.less,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.betweenThanOrEqualConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						lastValue.maximum || lastValue.minimum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										minimum: definition.greater,
										maximum: definition.less,
									},
								],
							}
							: {
								minimum: definition.greater,
								maximum: definition.less,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.greaterThanConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						lastValue.exclusiveMinimum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										exclusiveMinimum: definition.threshold,
									},
								],
							}
							: {
								exclusiveMinimum: definition.threshold,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.greaterThanOrEqualConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						lastValue.minimum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										minimum: definition.threshold,
									},
								],
							}
							: {
								minimum: definition.threshold,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.lessThanConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						lastValue.exclusiveMaximum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										exclusiveMaximum: definition.threshold,
									},
								],
							}
							: {
								exclusiveMaximum: definition.threshold,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.lessThanOrEqualConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						lastValue.maximum
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										maximum: definition.threshold,
									},
								],
							}
							: {
								maximum: definition.threshold,
							},
					),
				)
				.otherwise(() => next(lastValue)),
		),
		success,
	),
);
