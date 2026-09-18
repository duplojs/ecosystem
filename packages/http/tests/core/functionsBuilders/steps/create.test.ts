import { createCutStep, createExtractStep, createStepFunctionBuilder, defaultExtractContract, type ExtractStep, extractStepKind } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

describe("createStepFunctionBuilder", () => {
	const fakeFnc = vi.fn();
	const functionBuilder = createStepFunctionBuilder(
		extractStepKind.has,
		(step, { success }) => {
			type Check = DCommon.ExpectType<
				typeof step,
				ExtractStep,
				"strict"
			>;
			fakeFnc(step);

			return success({
				buildedFunction: () => ({}),
				hooksRouteLifeCycle: [],
			});
		},
	);

	beforeEach(() => {
		fakeFnc.mockClear();
	});

	it("support element", async() => {
		const result = await functionBuilder(
			createExtractStep({
				shape: {},
				metadata: [],
			}),
			{
				success: (element) => DEither.right("buildSuccess", element),
				buildStep: () => void undefined as never,
				environment: "DEV",
				defaultExtractContract,
			},
		);

		expect(DEither.isRight(result)).toBe(true);
		expect(fakeFnc).toHaveBeenCalledOnce();
	});

	it("not support element", async() => {
		const result = await functionBuilder(
			createCutStep({
				theFunction: () => ({}) as never,
				responseContract: [],
				metadata: [],
			}),
			{
				success: (element) => DEither.right("buildSuccess", element),
				buildStep: () => void undefined as never,
				environment: "DEV",
				defaultExtractContract,
			},
		);

		expect(DEither.hasInformation(result, "stepNotSupport")).toBe(true);
		expect(fakeFnc).not.toBeCalled();
	});
});
