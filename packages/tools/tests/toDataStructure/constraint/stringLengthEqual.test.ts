import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("stringLengthEqualConstraintTransformer", () => {
	it("renders an ISO country code", () => {
		const countryReference = DDataStructure.object({
			country: DDataStructure.string([DDataStructure.stringLengthEqual(2)]),
		});

		expect(DStoDS.render(countryReference, {
			identifier: "CountryReference",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.stringLengthEqualConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
