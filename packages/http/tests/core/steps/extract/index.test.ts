import { createExtractStep, extractStepKind, stepKind, type ExtractStepDefinition, ResponseContract } from "@core";
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
			responseContract: ResponseContract.unprocessableContent("invalid extract input"),
			metadata: [],
		};

		expect(createExtractStep(definition)).toStrictEqual({
			[extractStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
