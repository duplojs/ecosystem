import { createRoute, createRouteFunctionBuilder, type Route, defaultExtractContract } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { testRoute } from "@test-utils/route";

describe("createFunctionBuilder", () => {
	const fakeFnc = vi.fn();
	const functionBuilder = createRouteFunctionBuilder(
		(route) => route.definition.method === "GET",
		(route, { success }) => {
			type Check = DCommon.ExpectType<
				typeof route,
				Route,
				"strict"
			>;
			fakeFnc(route);

			return success(() => Promise.resolve());
		},
	);

	beforeEach(() => {
		fakeFnc.mockClear();
	});

	it("support element", async() => {
		const result = await functionBuilder(
			testRoute,
			{
				success: (element) => DEither.right("buildSuccess", element),
				buildStep: () => void undefined as never,
				environment: "DEV",
				globalHooksRouteLifeCycle: [],
				defaultExtractContract,
			},
		);

		expect(DEither.isRight(result)).toBe(true);
		expect(fakeFnc).toHaveBeenCalledOnce();
	});

	it("not support element", async() => {
		const result = await functionBuilder(
			createRoute({
				hooks: [],
				method: "POST",
				paths: ["/test"],
				preflightSteps: [],
				steps: [],
				metadata: [],
				bodyController: null,
			}),
			{
				success: (element) => DEither.right("buildSuccess", element),
				buildStep: () => void undefined as never,
				environment: "DEV",
				globalHooksRouteLifeCycle: [],
				defaultExtractContract,
			},
		);

		expect(DEither.hasInformation(result, "routeNotSupport")).toBe(true);
		expect(fakeFnc).not.toBeCalled();
	});
});
