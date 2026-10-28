import { useRouteBuilder, handlerStepKind, stepKind, routeKind, routeStore, IgnoreByRouteStoreMetadata, type PredictedResponse, type Request, type ServerSentEventsPredictedResponse, type StreamPredictedResponse, type StreamTextPredictedResponse } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("route builder handler", () => {
	it("infers the response body from the floor and preserves metadata and hooks", () => {
		const afterSendResponse = vi.fn(({ next }) => next());
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse }] })
			.extract({ body: DDataStructure.string() })
			.handler(async(floor, { response, request }) => {
				const path = await Promise.resolve(request.path);
				type _Floor = DCommon.ExpectType<
					typeof floor,
					{ body: string },
					"strict"
				>;
				type _Request = DCommon.ExpectType<
					typeof request,
					Request,
					"strict"
				>;
				return response.ok("found", { value: floor.body });
			}, IgnoreByRouteStoreMetadata());

		expect(routeKind.has(route)).toBe(true);
		expect(route.definition.hooks).toStrictEqual([{ afterSendResponse }]);
		expect(route.definition.steps[1]).toStrictEqual({
			[handlerStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition: {
				theFunction: expect.any(Function),
				metadata: [IgnoreByRouteStoreMetadata()],
			},
		});
		type Output = Awaited<ReturnType<typeof route.definition.steps[1]["definition"]["theFunction"]>>;
		type _Output = DCommon.ExpectType<
			Output,
			PredictedResponse<"200", "found", { readonly value: string }>,
			"strict"
		>;
	});

	it("infers the union of ordinary, SSE, binary and text responses", () => {
		const route = useRouteBuilder("GET", "/test")
			.handler(async(floor, { response, request }) => {
				const path = await Promise.resolve(request.path);
				if (path === "/sse") {
					return response.serverSentEvents("events").onStart<string, { ping: number }>(() => {});
				}
				if (path === "/binary") {
					return response.stream("binary").onStart<number>(() => {});
				}
				if (path === "/text") {
					return response.streamText("text").onStart(() => {});
				}
				return response.noContent("done");
			});
		type Output = Awaited<ReturnType<typeof route.definition.steps[0]["definition"]["theFunction"]>>;
		type ExpectedOutput =
			| PredictedResponse<"204", "done", undefined>
			| ServerSentEventsPredictedResponse<"200", "events", { message: string } & { ping: number }>
			| StreamPredictedResponse<"200", "binary", number>
			| StreamTextPredictedResponse<"200", "text">;
		type _Output = DCommon.ExpectType<
			Output,
			ExpectedOutput,
			"strict"
		>;
		expect(route.definition.steps[0].definition.metadata).toStrictEqual([]);
	});

	it("registers the route unless the route metadata excludes it", () => {
		const add = vi.spyOn(routeStore, "add");
		const route = useRouteBuilder("GET", "/stored").handler((floor, { response }) => response.noContent("done"));
		expect(add).toHaveBeenCalledWith(route);
		add.mockClear();
		useRouteBuilder("GET", "/ignored", { metadata: [IgnoreByRouteStoreMetadata()] })
			.handler((floor, { response }) => response.noContent("done"));
		expect(add).not.toHaveBeenCalled();
		add.mockRestore();
	});
});
