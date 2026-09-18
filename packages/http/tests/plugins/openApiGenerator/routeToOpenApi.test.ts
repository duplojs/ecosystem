import { controlBodyAsFormData, defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";
import { IgnoreByOpenApiGeneratorMetadata, routeToOpenApi } from "@plugin-openApiGenerator";
import * as DSDataStructure from "@duplojs/server/dataStructure";

describe("routeToOpenApi", () => {
	it("request body application/json", () => {
		const process1 = useProcessBuilder()
			.extract({
				headers: {
					header1: DDataStructure.string(),
					header2: DDataStructure.number(),
				},
				body: DDataStructure.string(),
			})
			.exports();

		const process2 = useProcessBuilder()
			.extract({})
			.exports();

		const route = useRouteBuilder("GET", "/test")
			.extract({
				headers: DDataStructure.object({
					header3: DDataStructure.string(),
					header4: DDataStructure.number(),
				}),
				body: {
					prop1: DDataStructure.string(),
					prop2: DDataStructure.number(),
				},
				query: DDataStructure.string(),
			})
			.exec(process1)
			.exec(process2)
			.presetCheck(testPresetChecker, () => "")
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(omitFunctions(result)).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [
						{
							name: "header3",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified0" },
						},
						{
							name: "header4",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified1" },
						},
						{
							name: "header1",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified2" },
						},
						{
							name: "header2",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified3" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/NotIdentified4" },
							},
						},
					},
					responses: {
						204: {
							headers: {
								information: {
									description: "test",
									schema: {
										const: "test",
										type: "string",
									},
								},
							},
						},
						404: {
							headers: {
								information: {
									description: "notFound",
									schema: {
										const: "notFound",
										type: "string",
									},
								},
							},
						},
						422: {
							headers: {
								information: {
									description: "extract-error",
									schema: {
										anyOf: [
											{
												anyOf: [
													{
														const: "extract-error",
														type: "string",
													},
													{
														const: "extract-error",
														type: "string",
													},
												],
											},
											{
												const: "extract-error",
												type: "string",
											},
										],
									},
								},
							},
						},
					},
				},
			],
		);
	});

	it("response body text/plain", () => {
		const route = useRouteBuilder("GET", "/test")
			.cut(
				ResponseContract.ok("cut", DDataStructure.string()),
				(__, { output, response }) => {
					if (Date.now() > 4) {
						return response("cut", "cut");
					}

					return output();
				},
			)
			.handler(
				ResponseContract.ok("handler", DDataStructure.string()),
				(__, { response }) => response("handler", "handler"),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [],
					requestBody: undefined,
					responses: {
						200: {
							headers: {
								information: {
									description: "cut | handler",
									schema: {
										anyOf: [
											{
												const: "cut",
												type: "string",
											},
											{
												const: "handler",
												type: "string",
											},
										],
									},
								},
							},
							content: {
								"text/plain": { schema: { $ref: "#/components/schemas/NotIdentified0" } },
							},
						},
					},
				},
			],
		);
	});

	it("response application/json", () => {
		const cutStepSchema = DDataStructure.object({
			toto: DDataStructure.string(),
		});
		const handlerStepSchema = DDataStructure.object({
			test: DDataStructure.literal("test"),
		});

		const route = useRouteBuilder("GET", "/test")
			.cut(
				ResponseContract.ok("cut", cutStepSchema),
				(__, { output, response }) => {
					if (Date.now() > 4) {
						return response("cut", { toto: "tr" });
					}

					return output();
				},
			)
			.handler(
				ResponseContract.ok("handler", handlerStepSchema),
				(__, { response }) => response("handler", { test: "test" }),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [],
					requestBody: undefined,
					responses: {
						200: {
							headers: {
								information: {
									description: "cut | handler",
									schema: {
										anyOf: [
											{
												const: "cut",
												type: "string",
											},
											{
												const: "handler",
												type: "string",
											},
										],
									},
								},
							},
							content: {
								"application/json": {
									schema: {
										anyOf: [
											{ $ref: "#/components/schemas/NotIdentified0" },
											{ $ref: "#/components/schemas/NotIdentified1" },
										],
									},
								},
							},
						},
					},
				},
			],
		);
	});

	it("request body multipart/form-data", () => {
		const route = useRouteBuilder("GET", "/test", { bodyController: controlBodyAsFormData({ maxFileQuantity: 10 }) })
			.extract({
				body: {
					superFile: DSDataStructure.file(),
					field: DDataStructure.boolean(),
				},
			})
			.handler(
				ResponseContract.ok("handler", DDataStructure.string()),
				(__, { response }) => response("handler", "handler"),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [],
					requestBody: {
						required: true,
						content: {
							"multipart/form-data": { schema: { $ref: "#/components/schemas/NotIdentified0" } },
						},
					},
					responses: {
						200: {
							headers: {
								information: {
									schema: {
										const: "handler",
										type: "string",
									},
									description: "handler",
								},
							},
							content: {
								"text/plain": { schema: { $ref: "#/components/schemas/NotIdentified2" } },
							},
						},
						422: {
							headers: {
								information: {
									schema: {
										const: "extract-error",
										type: "string",
									},
									description: "extract-error",
								},
							},
							content: undefined,
						},
					},
				},
			],
		);
	});

	it("request body text/plain", () => {
		const route = useRouteBuilder("GET", "/test")
			.extract({
				body: DDataStructure.number(),
			})
			.handler(
				ResponseContract.ok("handler", DDataStructure.string()),
				(__, { response }) => response("handler", "handler"),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [],
					requestBody: {
						required: true,
						content: {
							"text/plain": { schema: { $ref: "#/components/schemas/NotIdentified0" } },
						},
					},
					responses: {
						200: {
							headers: {
								information: {
									schema: {
										const: "handler",
										type: "string",
									},
									description: "handler",
								},
							},
							content: {
								"text/plain": { schema: { $ref: "#/components/schemas/NotIdentified2" } },
							},
						},
						422: {
							headers: {
								information: {
									schema: {
										const: "extract-error",
										type: "string",
									},
									description: "extract-error",
								},
							},
							content: undefined,
						},
					},
				},
			],
		);
	});

	it("ignored route", () => {
		const route = useRouteBuilder("GET", "/test", { metadata: [IgnoreByOpenApiGeneratorMetadata()] })
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual([]);
	});

	it("server sent events", () => {
		const route = useRouteBuilder("GET", "/test")
			.handler(
				[
					ResponseContract.serverSentEvents("see", DDataStructure.string()),
					ResponseContract.serverSentEvents("see2", DDataStructure.number()),
					ResponseContract.serverSentEventsContractKind.addTo({
						code: <const>"200",
						information: "test",
						body: DDataStructure.undefined(),
						events: {},
					}, null),
				],
				(__, { serverSentEventsResponse }) => serverSentEventsResponse("see", () => {}),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual([
			{
				method: "get",
				parameters: [],
				path: "/test",
				requestBody: undefined,
				responses: {
					200: {
						content: {
							"text/event-stream": {
								itemSchema: {
									anyOf: [
										{
											$ref: "#/components/schemas/NotIdentified0",
										},
										{
											$ref: "#/components/schemas/NotIdentified1",
										},
									],
								},
							},
						},
						headers: {
							information: {
								description: "see | see2",
								schema: {
									anyOf: [
										{
											const: "see",
											type: "string",
										},
										{
											const: "see2",
											type: "string",
										},
									],
								},
							},
						},
					},
				},
			},
		]);
	});

	it("stream", () => {
		const route = useRouteBuilder("GET", "/test")
			.handler(
				[
					ResponseContract.stream("stream", DDataStructure.string()),
					ResponseContract.stream("stream2", DDataStructure.string()),
				],
				(__, { streamResponse }) => streamResponse("stream", () => {}),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual([
			{
				method: "get",
				parameters: [],
				path: "/test",
				requestBody: undefined,
				responses: {
					200: {
						content: {
							"application/octet-stream": {
								schema: {
									anyOf: [
										{
											format: "binary",
											type: "string",
										},
										{
											format: "binary",
											type: "string",
										},
									],
								},
							},
						},
						headers: {
							information: {
								description: "stream | stream2",
								schema: {
									anyOf: [
										{
											const: "stream",
											type: "string",
										},
										{
											const: "stream2",
											type: "string",
										},
									],
								},
							},
						},
					},
				},
			},
		]);
	});

	it("stream text", () => {
		const route = useRouteBuilder("GET", "/test")
			.handler(
				[
					ResponseContract.streamText("streamText"),
					ResponseContract.streamText("stream2Text"),
				],
				(__, { streamTextResponse }) => streamTextResponse("streamText", () => {}),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual([
			{
				method: "get",
				parameters: [],
				path: "/test",
				requestBody: undefined,
				responses: {
					200: {
						content: {
							"text/plain": {
								schema: {
									anyOf: [
										{ $ref: "#/components/schemas/NotIdentified0" },
										{ $ref: "#/components/schemas/NotIdentified1" },
									],
								},
							},
						},
						headers: {
							information: {
								description: "streamText | stream2Text",
								schema: {
									anyOf: [
										{
											const: "streamText",
											type: "string",
										},
										{
											const: "stream2Text",
											type: "string",
										},
									],
								},
							},
						},
					},
				},
			},
		]);
	});
});
