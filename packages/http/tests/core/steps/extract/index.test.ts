import { createExtractStep, extractStepKind, stepKind, type ExtractStepDefinition } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("extractStep", () => {
	it("createExtractStep", () => {
		const definition: ExtractStepDefinition = {
			shape: {
				body: DDataStructure.string(),
				headers: {
					authorization: DDataStructure.string(),
				},
			},
			otherwise: ({ response }) => response.unprocessableContent("invalid extract input"),
			metadata: [],
		};

		expect(createExtractStep(definition)).toStrictEqual({
			[extractStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
