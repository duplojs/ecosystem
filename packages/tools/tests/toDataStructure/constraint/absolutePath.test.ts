import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS, DStoDS } from "@scripts";

describe("absolutePathConstraintTransformer", () => {
	it("renders an absolute storage root path", () => {
		const documentStorageConfig = DDataStructure.object({
			rootPath: DDataStructure.string([DDataStructure.absolutePath()]),
		});

		expect(DStoDS.render(documentStorageConfig, {
			identifier: "DocumentStorageConfig",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.absolutePathConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
