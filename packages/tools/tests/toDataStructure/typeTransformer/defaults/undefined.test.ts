import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("undefinedTypeTransformer", () => {
	it("renders an undefined type", () => {
		expect(DStoDS.render(DDataStructure.undefined(), {
			identifier: "UndefinedValue",
			typeTransformers: [DStoDS.undefinedTypeTransformer],
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
