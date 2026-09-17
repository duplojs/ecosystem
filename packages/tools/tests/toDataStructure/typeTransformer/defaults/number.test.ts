import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("numberTypeTransformer", () => {
	it("renders a number type", () => {
		expect(DStoDS.render(DDataStructure.number(), {
			identifier: "NumberValue",
			typeTransformers: [DStoDS.numberTypeTransformer],
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
