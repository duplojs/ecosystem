import * as DSDataStructure from "@duplojs/server/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("fileTypeTransformer", () => {
	it("renders a file type and its import", () => {
		expect(DStoDS.render(DSDataStructure.file(), {
			identifier: "FileValue",
			typeTransformers: DStoDS.defaultTypeTransformers,
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
