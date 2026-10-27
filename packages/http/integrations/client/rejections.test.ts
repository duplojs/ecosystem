import { createHub, routeStore, type ExtractOtherwise, type PredictedResponse, ResponseHelper } from "@duplojs/http";
import { createHttpClient } from "@duplojs/http/client";
import { createHttpServer } from "@duplojs/http/node";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { type CustomExtractionRejectionRoute, type ProductionRejectionRoutes } from "./clientType";
import "@routes/rejection";

declare module "@duplojs/http" {
	interface OverrideDefaultOtherwiseExtractResponse {
		override: PredictedResponse<"400", "custom-extract-error", { readonly source: "hub" }>;
	}
}

describe("client rejections in production", async() => {
	const hub = createHub({ environment: "PROD" }).register(routeStore.getAll());
	const server = await createHttpServer(hub, {
		host: "127.0.0.1",
		port: 0,
	});

	afterAll(() => {
		server.close();
	});

	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Expected a listening TCP server");
	}
	const client = createHttpClient<ProductionRejectionRoutes>({ baseUrl: `http://127.0.0.1:${address.port}` });

	it("receives the extraction error in PROD", async() => {
		const result = await client.post("/rejections/extract", {
			body: {
				// @ts-expect-error Exercise server validation with malformed input from an untyped caller.
				id: "invalid",
			},
		}).iWantInformationOrThrow("extract-error");

		type _Body = DCommon.ExpectType<
			typeof result.body,
			string,
			"strict"
		>;
		expect(result.code).toBe("422");
		expect(result.predicted).toBe(true);
		expect(result.body).toBe(new DDataStructure.Error([]).toString());
		expect(result.headers.get("extract-key")).toBe("request.body");
	});

	it("receives a checker rejection before later route steps", async() => {
		const result = await client.get("/rejections/checker").iWantInformationOrThrow("checker-rejected");

		type _Body = DCommon.ExpectType<
			typeof result.body,
			{ readonly reason: string },
			"strict"
		>;
		expect(result.code).toBe("403");
		expect(result.predicted).toBe(true);
		expect(result.body).toStrictEqual({ reason: "access-denied" });
	});

	it("propagates a nested process rejection and stops both processes and the route", async() => {
		const result = await client.get("/rejections/process").iWantInformationOrThrow("process-rejected");

		type _Body = DCommon.ExpectType<
			typeof result.body,
			{ readonly reason: "nested" },
			"strict"
		>;
		expect(result.code).toBe("409");
		expect(result.predicted).toBe(true);
		expect(result.body).toStrictEqual({ reason: "nested" });
	});
});

describe("client custom extraction rejection", async() => {
	const otherwise = vi.fn(({ response }: Parameters<ExtractOtherwise>[0]) => response.badRequest("custom-extract-error", { source: "hub" }));
	const hub = createHub({ environment: "PROD" })
		.register(routeStore.getAll())
		.setDefaultExtractOtherwise(otherwise);
	const server = await createHttpServer(hub, {
		host: "127.0.0.1",
		port: 0,
	});

	afterAll(() => {
		server.close();
	});

	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Expected a listening TCP server");
	}
	const client = createHttpClient<CustomExtractionRejectionRoute>({ baseUrl: `http://127.0.0.1:${address.port}` });

	it("receives the Hub rejection instead of the default extraction response", async() => {
		const result = await client.post("/rejections/extract", {
			body: {
				// @ts-expect-error Exercise server validation with malformed input from an untyped caller.
				id: "invalid",
			},
		}).iWantInformationOrThrow("custom-extract-error");

		type _Body = DCommon.ExpectType<
			typeof result.body,
			{ readonly source: "hub" },
			"strict"
		>;
		expect(result.code).toBe("400");
		expect(result.predicted).toBe(true);
		expect(result.body).toStrictEqual({ source: "hub" });
		expect(result.headers.get("extract-key")).toBe("request.body");
		expect(otherwise).toHaveBeenCalledTimes(1);
		expect(otherwise).toHaveBeenCalledWith({
			response: ResponseHelper,
			floor: {},
			dataStructureError: expect.any(DDataStructure.Error),
		});
	});
});
