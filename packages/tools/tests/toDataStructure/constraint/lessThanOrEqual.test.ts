import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("lessThanOrEqualConstraintTransformer", () => {
	it("renders a maximum reservation quantity", () => {
		const reservationRule = DDataStructure.object({
			quantity: DDataStructure.number([DDataStructure.lessThanOrEqual(25)]),
		});

		expect(DStoDS.render(reservationRule, {
			identifier: "ReservationRule",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.lessThanOrEqualConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
