import { createHandlerStep, handlerStepKind, stepKind, type HandlerStepDefinition, ResponseContract } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("handlerStep", () => {
	it("createHandlerStep", () => {
		const definition: HandlerStepDefinition = {
			theFunction: (_floor, params) => params.response("handler ok", undefined as never),
			responseContract: [ResponseContract.ok("handler ok", DDataStructure.undefined())],
			metadata: [],
		};

		expect(createHandlerStep(definition)).toStrictEqual({
			[handlerStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
