import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DStoDS, DStoTS, Typescript } from "@scripts";

describe("typeTransformer", () => {
	it("uses the first successful transformer with its import context", () => {
		const unsupportedTransformer = vi.fn((
			type: DDataStructure.Type,
		) => DEither.left("dataStructureTypeNotSupport", type));
		const successfulTransformerImplementation: DStoDS.TypeTransformer = (
			_type,
			{
				addImport,
				success,
			},
		) => {
			addImport("@acme/custom-types", "ExternalStringType", "direct");

			return success(Typescript.factory.createIdentifier("ExternalStringType"));
		};
		const successfulTransformer = vi.fn(successfulTransformerImplementation);
		const unusedTransformer = vi.fn(successfulTransformerImplementation);

		expect(DStoDS.render(DDataStructure.string(), {
			identifier: "ExternalString",
			typeTransformers: [
				unsupportedTransformer,
				successfulTransformer,
				unusedTransformer,
			],
			structureTransformers: [DStoDS.typeStructureTransformer],
			constraintTransformers: [],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();

		expect(unsupportedTransformer).toHaveBeenCalledOnce();
		expect(successfulTransformer).toHaveBeenCalledOnce();
		expect(unusedTransformer).not.toHaveBeenCalled();
	});

	it("stops on a transformer build error", () => {
		const errorTransformerImplementation: DStoDS.TypeTransformer = (
			_type,
			{ buildError },
		) => buildError();
		const successTransformerImplementation: DStoDS.TypeTransformer = (
			_type,
			{ success },
		) => success(Typescript.factory.createIdentifier("UnexpectedType"));
		const errorTransformer = vi.fn(errorTransformerImplementation);
		const successTransformer = vi.fn(successTransformerImplementation);
		const structure = DDataStructure.string();

		try {
			DStoDS.render(structure, {
				identifier: "InvalidString",
				typeTransformers: [errorTransformer, successTransformer],
				structureTransformers: [DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			});

			expect.unreachable();
		} catch (error) {
			expect(error).toBeInstanceOf(DStoDS.DataStructureToDataStructureRenderError);

			if (!(error instanceof DStoDS.DataStructureToDataStructureRenderError)) {
				return;
			}

			expect(DEither.unwrapByInformationOrThrow(
				error.error,
				"buildDataStructureTypeError",
			)).toBe(structure.definition.type);
		}

		expect(errorTransformer).toHaveBeenCalledOnce();
		expect(successTransformer).not.toHaveBeenCalled();
	});

	it("reports an unsupported type when no transformer is available", () => {
		const structure = DDataStructure.string();

		try {
			DStoDS.render(structure, {
				identifier: "UnsupportedString",
				typeTransformers: [],
				structureTransformers: [DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			});

			expect.unreachable();
		} catch (error) {
			expect(error).toBeInstanceOf(DStoDS.DataStructureToDataStructureRenderError);

			if (!(error instanceof DStoDS.DataStructureToDataStructureRenderError)) {
				return;
			}

			expect(DEither.unwrapByInformationOrThrow(
				error.error,
				"dataStructureTypeNotSupport",
			)).toBe(structure.definition.type);
		}
	});
});
