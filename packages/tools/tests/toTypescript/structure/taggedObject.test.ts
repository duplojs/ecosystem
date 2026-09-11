import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS, Typescript } from "@scripts";

describe("taggedObjectStructureTransformer", () => {
	it("creates a declaration placeholder when the context is empty", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			id: DDataStructure.number(),
			name: DDataStructure.string(),
		});
		const context = new Map();

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
			context,
		})).toContain("export interface User extends DModeling.ObjectTag<\"User\">");
	});

	it("uses a prefilled declaration placeholder from a preceding transformer", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			id: DDataStructure.number(),
			name: DDataStructure.string(),
		});
		const prefilledPlaceholderTransformer: DStoTS.StructureTransformer = (
			currentStructure,
			params,
		) => {
			if (DDataStructure.structureIdentifier(currentStructure, DModeling.taggedObjectStructureKind)) {
				params.context.set(
					currentStructure,
					Typescript.factory.createInterfaceDeclaration(
						[Typescript.factory.createModifier(Typescript.SyntaxKind.ExportKeyword)],
						"User",
						undefined,
						[],
						[],
					),
				);
			}

			return DEither.left("dataStructureNotSupport", currentStructure);
		};

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: [
				prefilledPlaceholderTransformer,
				...DStoTS.defaultStructureTransformers,
			],
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toContain("export interface User extends DModeling.ObjectTag<\"User\">");
	});

	it("renders a tagged object as an interface", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			id: DDataStructure.number(),
			name: DDataStructure.string(),
		});

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("renders a tagged audit event with nested payloads", () => {
		const structure = DModeling.TaggedObjectStructure("AuditEvent", {
			id: DDataStructure.string([DDataStructure.uuid()]),
			actorId: DModeling.NewTypeStructure("UserId", DDataStructure.string(), []),
			payload: DDataStructure.union([
				DDataStructure.object({
					type: DDataStructure.literal("product.updated"),
					changes: DDataStructure.record(DDataStructure.string(), DDataStructure.string()),
				}),
				DDataStructure.object({
					type: DDataStructure.literal("stock.adjusted"),
					quantity: DDataStructure.number([DDataStructure.integer()]),
				}),
			]),
		});

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("propagates an unsupported property", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			name: DDataStructure.string(),
		});

		expect(() => DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: [],
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});

	it("rejects a transformed inner structure that is not an object type", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			name: DDataStructure.string(),
		});
		const objectAsStringTransformer = DStoTS.createStructureTransformer(
			(currentStructure) => DDataStructure.structureIdentifier(
				currentStructure,
				DDataStructure.objectStructureKind,
			),
			(_currentStructure, { success }) => success(
				Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.StringKeyword),
			),
		);

		expect(() => DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: [
				objectAsStringTransformer,
				...DStoTS.defaultStructureTransformers,
			],
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			id: DDataStructure.number(),
			name: DDataStructure.string(),
		}).addIdentifier("Test");
		const context = new Map();

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
			context,
		})).toMatchSnapshot();
	});
});
