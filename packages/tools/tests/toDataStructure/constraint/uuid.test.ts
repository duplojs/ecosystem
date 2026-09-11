import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("uuidConstraintTransformer", () => {
	it("renders a customer identifier UUID", () => {
		const customerReference = DDataStructure.object({
			id: DDataStructure.string([DDataStructure.uuid()]),
		});

		expect(DStoDS.render(customerReference, {
			identifier: "CustomerReference",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.uuidConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
