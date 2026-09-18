import { type ExtractStep, extractStepKind, type HandlerStep, handlerStepKind, ResponseContract, type Route, routeKind, stepKind, useRouteBuilder, type PredictedResponse, type HandlerStepFunctionParams, type Request, routeStore, IgnoreByRouteStoreMetadata, type Metadata, type RouteHookParamsAfter, type RouteHookNext, type ServerSentEventsPredictedResponse, type StreamPredictedResponse, type StreamTextPredictedResponse } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("route builder handler method", () => {
	it("handler", () => {
		const routeBuilder = useRouteBuilder("GET", "/test", { metadata: [IgnoreByRouteStoreMetadata()] })
			.extract({ body: DDataStructure.string() })
			.handler(
				ResponseContract.ok("test", DDataStructure.string()),
				(floor, { response }) => {
					type Check = DCommon.ExpectType<
						typeof floor,
						{ body: string },
						"strict"
					>;

					return response("test", "toto");
				},
				IgnoreByRouteStoreMetadata(),
			);

		expect({ ...routeBuilder }).toStrictEqual({
			[routeKind.runTimeKey]: null,
			definition: {
				hooks: [],
				method: "GET",
				paths: ["/test"],
				preflightSteps: [],
				bodyController: null,
				metadata: [IgnoreByRouteStoreMetadata()],
				steps: [
					expect.objectContaining({
						[extractStepKind.runTimeKey]: null,
					}),
					{
						[handlerStepKind.runTimeKey]: null,
						[stepKind.runTimeKey]: null,
						definition: {
							theFunction: expect.any(Function),
							responseContract: expect.objectContaining({
								[ResponseContract.contractKind.runTimeKey]: null,
								code: "200",
							}),
							metadata: [IgnoreByRouteStoreMetadata()],
						},
					},
				],
			},
		});

		expect([...routeStore.getAll()]).toStrictEqual([]);

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: DDataStructure.TypeStructure<string, readonly []>;
							};
							readonly responseContract: undefined;
							readonly metadata: readonly [];
						}>,
						HandlerStep<{
							readonly responseContract: ResponseContract.Contract<
								"200",
								"test",
								DDataStructure.TypeStructure<string, readonly []>
							>;
							theFunction(
								floor: { body: string },
								param: HandlerStepFunctionParams<
									PredictedResponse<"200", "test", string>
								>
							): DCommon.MaybePromise<PredictedResponse<"200", "test", string>>;
							readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
						}>,
					];
					readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
				}
			>,
			"strict"
		>;
	});

	it("handler with multi contract", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.handler(
				[
					ResponseContract.ok("test", DDataStructure.string()),
					ResponseContract.serverSentEvents("sse", DDataStructure.string()),
					ResponseContract.stream("stream", DDataStructure.number()),
					ResponseContract.streamText("streamText"),
				],
				(floor, { response, serverSentEventsResponse, streamResponse, streamTextResponse }) => {
					if (!!true as boolean) {
						//@ts-expect-error contract data error
						return response("test", 1);
					}

					if (!!true as boolean) {
						return serverSentEventsResponse(
							"sse",
							async({ send }) => {
								await send("message", "");

								//@ts-expect-error contract event error
								await send("", "");
							},
						);
					}

					if (!!true as boolean) {
						return streamResponse(
							"stream",
							async({ send }) => {
								await send(1);

								//@ts-expect-error contract data error
								await send("");
							},
						);
					}

					if (!!true as boolean) {
						return streamTextResponse(
							"streamText",
							async({ send }) => {
								await send("");

								//@ts-expect-error contract data error
								await send(1);
							},
						);
					}

					return response("test", "test");
				},
			);

		expect([...routeStore.getAll()]).toContain(routeBuilder);

		expect({ ...routeBuilder }).toStrictEqual({
			[routeKind.runTimeKey]: null,
			definition: {
				hooks: [],
				method: "GET",
				paths: ["/test"],
				preflightSteps: [],
				bodyController: null,
				metadata: [],
				steps: [
					{
						[handlerStepKind.runTimeKey]: null,
						[stepKind.runTimeKey]: null,
						definition: {
							theFunction: expect.any(Function),
							responseContract: [
								expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "200",
								}),
								expect.objectContaining({
									[ResponseContract.serverSentEventsContractKind.runTimeKey]: null,
									code: "200",
								}),
								expect.objectContaining({
									[ResponseContract.streamContractKind.runTimeKey]: null,
									code: "200",
								}),
								expect.objectContaining({
									[ResponseContract.streamTextContractKind.runTimeKey]: null,
									code: "200",
								}),
							],
							metadata: [],
						},
					},
				],
			},
		});

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly bodyController: null;
					readonly steps: readonly [
						HandlerStep<{
							readonly responseContract: [
								ResponseContract.Contract<
									"200",
									"test",
									DDataStructure.TypeStructure<string, readonly []>
								>,
								ResponseContract.ServerSentEventsContract<
									"200",
									"sse",
									{
										message: DDataStructure.TypeStructure<string, readonly []>;
									},
									DDataStructure.TypeStructure<undefined, readonly []>
								>,
								ResponseContract.StreamContract<
									"200",
									"stream",
									DDataStructure.TypeStructure<number, readonly []>,
									DDataStructure.TypeStructure<undefined, readonly []>
								>,
								ResponseContract.StreamTextContract<
									"200",
									"streamText",
									DDataStructure.TypeStructure<string, readonly []>,
									DDataStructure.TypeStructure<undefined, readonly []>
								>,
							];
							theFunction(
								floor: {},
								param: HandlerStepFunctionParams<
									| PredictedResponse<"200", "test", string>
									| ServerSentEventsPredictedResponse<"200", "sse", { readonly message: string }>
									| StreamPredictedResponse<"200", "stream", number>
									| StreamTextPredictedResponse<"200", "streamText">
								>
							): DCommon.MaybePromise<
								| PredictedResponse<"200", "test", string>
								| ServerSentEventsPredictedResponse<"200", "sse", { readonly message: string }>
								| StreamPredictedResponse<"200", "stream", number>
								| StreamTextPredictedResponse<"200", "streamText">
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				}
			>,
			"strict"
		>;
	});

	it("handler with hooks", () => {
		const routeBuilder = useRouteBuilder("GET", "/test", {
			hooks: [{ afterSendResponse: ({ next }) => next() }],
		})
			.handler(
				ResponseContract.noContent("toto"),
				(floor, { response, request }) => response("toto"),
			);

		expect({ ...routeBuilder }).toStrictEqual({
			[routeKind.runTimeKey]: null,
			definition: {
				hooks: [{ afterSendResponse: expect.any(Function) }],
				method: "GET",
				paths: ["/test"],
				preflightSteps: [],
				bodyController: null,
				metadata: [],
				steps: [
					{
						[handlerStepKind.runTimeKey]: null,
						[stepKind.runTimeKey]: null,
						definition: {
							theFunction: expect.any(Function),
							responseContract: expect.objectContaining({
								[ResponseContract.contractKind.runTimeKey]: null,
								code: "204",
							}),
							metadata: [],
						},
					},
				],
			},
		});

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly hooks: readonly [
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
					];
					readonly steps: readonly [
						HandlerStep<{
							readonly responseContract: ResponseContract.Contract<
								"204",
								"toto",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							theFunction(
								floor: {},
								param: HandlerStepFunctionParams<
									PredictedResponse<"204", "toto", undefined>
								>
							): DCommon.MaybePromise<PredictedResponse<"204", "toto", undefined>>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				}
			>,
			"strict"
		>;
	});
});
