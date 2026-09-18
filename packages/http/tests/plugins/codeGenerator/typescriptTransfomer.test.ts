import { DataStructureToTypescript } from "@duplojs/tools";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { dateTransformer, fileTransformer, timeTransformer } from "@plugin-codeGenerator/typescriptTransformer";

describe("typescript transformer", () => {
	it("file", () => {
		expect(
			DataStructureToTypescript.render(
				DDataStructure.array(DSDataStructure.file()),
				{
					identifier: "ArrayString",
					typeTransformers: [fileTransformer, ...DataStructureToTypescript.defaultTypeTransformers],
					constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
					structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("date", () => {
		expect(
			DataStructureToTypescript.render(
				DDataStructure.array(DDataStructure.date()),
				{
					identifier: "ArrayString",
					typeTransformers: [dateTransformer, ...DataStructureToTypescript.defaultTypeTransformers],
					constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
					structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("time", () => {
		expect(
			DataStructureToTypescript.render(
				DDataStructure.array(DDataStructure.time()),
				{
					identifier: "ArrayString",
					typeTransformers: [timeTransformer, ...DataStructureToTypescript.defaultTypeTransformers],
					constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
					structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
				},
			),
		).toMatchSnapshot();
	});
});
