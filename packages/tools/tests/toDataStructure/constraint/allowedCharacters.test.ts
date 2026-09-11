import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("allowedCharactersConstraintTransformer", () => {
	it("renders invite code character ranges", () => {
		const inviteCode = DDataStructure.object({
			code: DDataStructure.string([DDataStructure.allowedCharacters(["A-Z", "0-9"])]),
			shortCode: DDataStructure.string([DDataStructure.allowedCharacters("A-Z")]),
		});

		expect(DStoDS.render(inviteCode, {
			identifier: "InviteCode",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.allowedCharactersConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
