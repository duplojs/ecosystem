import { createCutStep, PredictedResponse } from "@core";
import { createTestRequest } from "@test-utils/createTestRequest";
import { useTestStepFunctionBuilder } from "@test-utils/useTestStepFunctionBuilder";

describe("cut step function builder", () => {
	it("returns the exact response with its headers and body", async() => {
		const body = {
			value: "unrestricted",
			extra: true,
		};
		const request = createTestRequest();
		const floor = { existing: 42 };
		const theFunction = vi.fn((input, { response, request: receivedRequest }) => {
			expect(input).toBe(floor);
			expect(receivedRequest).toBe(request);
			return response.forbidden("cut-rejected", body).setHeader("x-reason", "test");
		});
		const built = await useTestStepFunctionBuilder(createCutStep({
			theFunction,
			metadata: [],
		}));
		const result = await built.buildedFunction(request, floor);
		expect(result).toBe(theFunction.mock.results[0]?.value);
		expect(result).toStrictEqual(new PredictedResponse("403", "cut-rejected", body).setHeader("x-reason", "test"));
		expect(built.hooksRouteLifeCycle).toStrictEqual([]);
	});

	it("merges output without mutating the original floor", async() => {
		const floor = {
			kept: true,
			replaced: "old",
		};
		const step = createCutStep({
			theFunction: (input, { output }) => output({
				replaced: 42,
				added: "value",
			}),
			metadata: [],
		});
		const built = await useTestStepFunctionBuilder(step);
		expect(await built.buildedFunction(createTestRequest(), floor)).toStrictEqual({
			kept: true,
			replaced: 42,
			added: "value",
		});
		expect(floor).toStrictEqual({
			kept: true,
			replaced: "old",
		});
	});

	it("supports asynchronous empty output", async() => {
		const step = createCutStep({
			theFunction: (floor, { output }) => Promise.resolve(output()),
			metadata: [],
		});
		const built = await useTestStepFunctionBuilder(step);
		expect(await built.buildedFunction(createTestRequest(), { kept: true })).toStrictEqual({ kept: true });
	});

	it("awaits an asynchronous response", async() => {
		const step = createCutStep({
			theFunction: (floor, { response }) => Promise.resolve(response.conflict("busy")),
			metadata: [],
		});
		const built = await useTestStepFunctionBuilder(step);
		expect(
			await built.buildedFunction(
				createTestRequest(),
				{},
			),
		).toStrictEqual(
			new PredictedResponse("409", "busy", undefined),
		);
	});
});
