import { DataStructureToTypescript } from "@duplojs/tools";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { fileTransformer } from "@plugin-codeGenerator/typescriptTransformer";

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
});
