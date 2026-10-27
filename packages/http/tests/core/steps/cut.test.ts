import { createCutStep, cutStepKind, stepKind, type CutStepDefinition } from "@core";

describe("cutStep", () => {
	it("createCutStep", () => {
		const definition: CutStepDefinition = {
			theFunction: (_floor, params) => params.output({ foo: "bar" }),
			metadata: [],
		};

		expect(createCutStep(definition)).toStrictEqual({
			[cutStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
