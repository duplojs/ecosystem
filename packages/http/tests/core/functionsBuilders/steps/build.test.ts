import { buildStepFunction, createExtractStep, createStepFunctionBuilder, defaultExtractContract } from "@core";
import * as DEither from "@duplojs/lang/either";

describe("buildStepFunction", () => {
	const spySupport = vi.fn(() => true);
	const spyBuild = vi.fn(async(step, { success, buildStep }) => {
		const result = await buildStep(step);
		if (DEither.isRight(result)) {
			return result;
		}
		return success({
			buildedFunction: () => ({}),
			hooksRouteLifeCycle: [],
		});
	});
	const stepFunctionBuilders = createStepFunctionBuilder(
		spySupport as never,
		spyBuild,
	);

	beforeEach(() => {
		spySupport.mockClear();
		spyBuild.mockClear();
	});

	it("build step", async() => {
		spySupport
			.mockImplementationOnce(() => true)
			.mockImplementationOnce(() => false);

		const result = await buildStepFunction(
			createExtractStep({
				shape: {},
				metadata: [],
			}),
			{
				environment: "DEV",
				stepFunctionBuilders: [stepFunctionBuilders],
				defaultExtractContract,
			},
		);

		expect(DEither.isRight(result)).toBe(true);
		expect(spyBuild).toHaveBeenCalledOnce();
	});

	it("not build step", async() => {
		spySupport.mockImplementation(() => false);

		const result = await buildStepFunction(
			createExtractStep({
				shape: {},
				metadata: [],
			}),
			{
				environment: "DEV",
				stepFunctionBuilders: [stepFunctionBuilders],
				defaultExtractContract,
			},
		);

		expect(DEither.isRight(result)).toBe(false);
		expect(spyBuild).not.toHaveBeenCalledOnce();
	});
});
