import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS, Typescript } from "@scripts";

describe("toDataStructure override", () => {
	it("renders an overridden data structure without mutating the source structure", () => {
		const sourceStructure = DDataStructure.string();
		const structure = sourceStructure.addOverrideDataStructureTransformer(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("StringType"),
				),
				undefined,
				[],
			),
		);

		expect(sourceStructure.definition.overrideDataStructureTransformer).toBeUndefined();
		expect(structure).not.toBe(sourceStructure);
		expect(DStoDS.render(structure, {
			identifier: "ExternalSku",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("sets and removes an override on the current structure", () => {
		const structure = DDataStructure.number()
			.setOverrideDataStructureTransformer(
				(_currentStructure, { transformer }) => transformer(DDataStructure.string()),
			);

		expect(DStoDS.render(structure, {
			identifier: "SearchScore",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();

		const clonedStructure = structure.addOverrideDataStructureTransformer(null);
		structure.setOverrideDataStructureTransformer(null);

		expect(structure.definition.overrideDataStructureTransformer).toBeUndefined();
		expect(clonedStructure.definition.overrideDataStructureTransformer).toBeUndefined();
		expect(clonedStructure).not.toBe(structure);
	});

	it("renders an overridden constraint without mutating the source constraint", () => {
		const sourceConstraint = DDataStructure.notEmpty();
		const constraint = sourceConstraint.addOverrideConstraintTransformer(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("EmailConstraint"),
				),
				undefined,
				[],
			),
		);

		expect(sourceConstraint.definition.overrideConstraintTransformer).toBeUndefined();
		expect(constraint).not.toBe(sourceConstraint);
		expect(DStoDS.render(DDataStructure.string([constraint]), {
			identifier: "CustomerEmail",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("sets and removes an override on the current constraint", () => {
		const constraint = DDataStructure.email()
			.setOverrideConstraintTransformer(
				(_currentConstraint, { success }) => success(
					Typescript.factory.createCallExpression(
						Typescript.factory.createPropertyAccessExpression(
							Typescript.factory.createIdentifier("DDataStructure"),
							Typescript.factory.createIdentifier("NotEmptyConstraint"),
						),
						undefined,
						[],
					),
				),
			);

		expect(DStoDS.render(DDataStructure.string([constraint]), {
			identifier: "CustomerName",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();

		const clonedConstraint = constraint.addOverrideConstraintTransformer(null);
		constraint.setOverrideConstraintTransformer(null);

		expect(constraint.definition.overrideConstraintTransformer).toBeUndefined();
		expect(clonedConstraint.definition.overrideConstraintTransformer).toBeUndefined();
		expect(clonedConstraint).not.toBe(constraint);
	});

	it("throws when an override reports a build error", () => {
		const structure = DDataStructure.object({
			orderId: DDataStructure.string([DDataStructure.uuid()]),
		}).addOverrideDataStructureTransformer(
			(_currentStructure, { buildError }) => buildError(),
		);

		expect(() => DStoDS.render(structure, {
			identifier: "OrderProjection",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toThrowErrorMatchingSnapshot();
	});

	it("throws when a constraint override reports a build error", () => {
		const structure = DDataStructure.string([
			DDataStructure.uuid().addOverrideConstraintTransformer(
				(_currentConstraint, { buildError }) => buildError(),
			),
		]);

		expect(() => DStoDS.render(structure, {
			identifier: "CustomerId",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toThrowErrorMatchingSnapshot();
	});
});
