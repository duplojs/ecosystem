import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("nullTypeTransformer", () => {
	it("renders a null type", () => {
		expect(DStoDS.render(DDataStructure.null(), {
			identifier: "NullValue",
			typeTransformers: [DStoDS.nullTypeTransformer],
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
