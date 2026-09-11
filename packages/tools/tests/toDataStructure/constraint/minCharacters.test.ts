import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("minCharactersConstraintTransformer", () => {
	it("renders a minimum customer name length", () => {
		const customerIdentity = DDataStructure.object({
			displayName: DDataStructure.string([DDataStructure.minCharacters(3)]),
		});

		expect(DStoDS.render(customerIdentity, {
			identifier: "CustomerIdentity",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.minCharactersConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
