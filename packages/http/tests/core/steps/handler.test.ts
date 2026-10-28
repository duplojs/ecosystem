import { createHandlerStep, handlerStepKind, stepKind, type HandlerStepDefinition } from "@core";

describe("handlerStep", () => {
	it("createHandlerStep", () => {
		const definition: HandlerStepDefinition = {
			theFunction: (_floor, params) => params.response.noContent("handler ok"),
			metadata: [],
		};

		expect(createHandlerStep(definition)).toStrictEqual({
			[handlerStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
