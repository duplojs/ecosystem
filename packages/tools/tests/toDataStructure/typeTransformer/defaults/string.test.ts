import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("stringTypeTransformer", () => {
	it("renders a string type", () => {
		expect(DStoDS.render(DDataStructure.string(), {
			identifier: "StringValue",
			typeTransformers: [DStoDS.stringTypeTransformer],
			structureTransformers: [DStoDS.typeStructureTransformer],
			constraintTransformers: [],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
