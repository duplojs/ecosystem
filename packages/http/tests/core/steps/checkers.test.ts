import { ResponseHelper, checkerStepKind, createCheckerStep, stepKind } from "@core";
import { testChecker } from "@test-utils/checker";

describe("checkerStep", () => {
	it("createCheckerStep", () => {
		expect(
			createCheckerStep({
				checker: testChecker,
				result: "result",
				input: () => ({}),
				otherwise: () => ResponseHelper.badRequest("rejected"),
				metadata: [],
			}),
		).toStrictEqual({
			[checkerStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition: {
				checker: testChecker,
				result: "result",
				input: expect.any(Function),
				otherwise: expect.any(Function),
				metadata: [],
			},
		});
	});
});
