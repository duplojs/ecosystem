import { ResponseContract, useRouteBuilder, Request, Response, PredictedResponse } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createBodyReader } from "@test-utils/bodyReader";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";

describe("cut step function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	it("response from cut", async() => {
		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.cut(
				[ResponseContract.ok("goodCut", DDataStructure.string())],
				(floor, { response }) => response("goodCut", floor.value),
			)
			.handler(
				ResponseContract.ok("good", DDataStructure.string()),
				(floor, { response }) => response("good", floor.value),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: { value: "test" },
				query: {},
				url: "",
				bodyReader: createBodyReader(),

			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "goodCut", "test"),
			}),
		);
	});

	it("missing contract error", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.cut(
				ResponseContract.noContent("good"),
				(floor, { response }) => response("wrongInfo" as any),
			)
			.handler(
				ResponseContract.noContent("good"),
				(floor, { response }) => response("good"),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),

			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("500", "server-error", new ResponseContract.Error("wrongInfo", "Contract not found.")),
			}),
		);
	});

	it("missing contract error", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.cut(
				[ResponseContract.ok("good", DDataStructure.string([DDataStructure.maxCharacters(3)]))],
				(floor, { response }) => response("good", "1234" as never),
			)
			.handler(
				ResponseContract.noContent("good"),
				(floor, { response }) => response("good"),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),

			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response(
					"500",
					"server-error",
					new ResponseContract.Error(
						"good",
						expect.any(DDataStructure.Error),
					),
				),
			}),
		);
	});

	it("cut passe value", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.cut([], (floor, { output }) => output({ cutValue: "test" }))
			.handler(
				ResponseContract.ok("good", DDataStructure.string()),
				(floor, { response }) => response("good", floor.cutValue),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),

			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "good", "test"),
			}),
		);
	});

	it("async cut passe value", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.cut([], (floor, { output }) => Promise.resolve(output()))
			.handler(
				ResponseContract.noContent("good"),
				(floor, { response }) => response("good"),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),

			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("204", "good", undefined),
			}),
		);
	});
});
