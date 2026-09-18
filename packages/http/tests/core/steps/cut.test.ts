import { createCutStep, cutStepKind, stepKind, type CutStepDefinition, ResponseContract } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("cutStep", () => {
	it("createCutStep", () => {
		const definition: CutStepDefinition = {
			theFunction: (_floor, params) => params.output({ foo: "bar" }),
			responseContract: ResponseContract.ok("cut ok", DDataStructure.undefined()),
			metadata: [],
		};

		expect(createCutStep(definition)).toStrictEqual({
			[cutStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
