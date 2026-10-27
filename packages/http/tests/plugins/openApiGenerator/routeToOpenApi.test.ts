import { controlBodyAsFormData, useProcessBuilder, useRouteBuilder, usePreflightBuilder, type Route } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import { IgnoreByOpenApiGeneratorMetadata, OpenApiEndpointContractMetadata, routeToOpenApi, type RouteToOpenApiParams } from "@plugin-openApiGenerator";

describe("routeToOpenApi", () => {
	function render(route: Route, options: Partial<RouteToOpenApiParams> = {}) {
		const context: RouteToOpenApiParams = {
			contextToJsonSchemaFactory: new Map(),
			resultSchemaContext: new Map(),
			...options,
		};
		const [result] = routeToOpenApi(route, context);
		if (!result) {
			throw new Error("Expected an OpenAPI route");
		}
		return {
			result,
			schemas: context.resultSchemaContext,
		};
	}

	it("documents only explicit output metadata even when it differs from the handler", () => {
		const handler = vi.fn((floor, { response }) => response.ok("actual", { id: 42 }));
		const route = useRouteBuilder("GET", "/test")
			.handler(handler, OpenApiEndpointContractMetadata({
				code: "201",
				information: "documented",
				description: "Created user",
				body: DDataStructure.string(),
			}));
		const { result } = render(route);
		expect(handler).not.toHaveBeenCalled();
		expect(result.responses).toStrictEqual({
			201: {
				description: "Created user",
				headers: {
					information: {
						description: "documented",
						schema: {
							const: "documented",
							type: "string",
						},
					},
				},
				content: { "text/plain": { schema: { $ref: "#/components/schemas/NotIdentified0" } } },
			},
		});
	});

	it("keeps undocumented routes empty", () => {
		const route = useRouteBuilder("GET", "/test").handler((floor, { response }) => response.noContent("done"));
		expect(render(route).result.responses).toStrictEqual({});
	});

	it("uses the default extract metadata and accepts its replacement", () => {
		const route = useRouteBuilder("GET", "/test")
			.extract({})
			.handler((floor, { response }) => response.noContent("done"));
		expect(render(route).result.responses).toHaveProperty("422.description", "extract-error");
		const { result } = render(route, {
			defaultExtractMetadata: OpenApiEndpointContractMetadata({
				code: "400",
				information: "custom-invalid",
			}),
		});
		expect(result.responses).toStrictEqual({
			400: {
				description: "custom-invalid",
				headers: {
					information: {
						description: "custom-invalid",
						schema: {
							type: "string",
							const: "custom-invalid",
						},
					},
				},
				content: undefined,
			},
		});
	});

	it("collects route and preflight metadata and nested process metadata", () => {
		const process = useProcessBuilder({
			metadata: [
				OpenApiEndpointContractMetadata({
					code: "403",
					information: "nested",
				}),
			],
		})
			.exports();
		const nested = useProcessBuilder().exec(process).exports();
		const route = usePreflightBuilder({
			metadata: [
				OpenApiEndpointContractMetadata({
					code: "401",
					information: "preflight",
				}),
			],
		})
			.exec(nested)
			.useRouteBuilder("GET", "/test", {
				metadata: [
					OpenApiEndpointContractMetadata({
						code: "404",
						information: "route",
					}),
				],
			})
			.handler((floor, { response }) => response.noContent("done"));
		const { result } = render(route);
		expect(result.responses).toHaveProperty("401.description", "preflight");
		expect(result.responses).toHaveProperty("403.description", "nested");
		expect(result.responses).toHaveProperty("404.description", "route");
	});

	it.each([
		{
			body: DDataStructure.string(),
			contentType: "text/plain",
		},
		{
			body: DDataStructure.literal("hello"),
			contentType: "text/plain",
		},
		{
			body: DDataStructure.union([DDataStructure.literal("a"), DDataStructure.string()]),
			contentType: "text/plain",
		},
		{
			body: DDataStructure.object({ id: DDataStructure.number() }),
			contentType: "application/json",
		},
		{
			body: DDataStructure.union([DDataStructure.string(), DDataStructure.number()]),
			contentType: "application/json",
		},
	])("documents body as $contentType", ({ body, contentType }) => {
		const route = useRouteBuilder("GET", "/test")
			.handler((floor, { response }) => response.noContent("done"), OpenApiEndpointContractMetadata({
				code: "200",
				information: "data",
				body,
			}));
		const { result, schemas } = render(route);
		expect(
			result.responses["200"]?.content,
		).toStrictEqual(
			{ [contentType]: { schema: { $ref: "#/components/schemas/NotIdentified0" } } },
		);
		expect(schemas.size).toBe(1);
	});

	it("merges schemas for the same code while retaining all content types", () => {
		const route = useRouteBuilder("GET", "/test")
			.handler((floor, { response }) => response.noContent("done"), OpenApiEndpointContractMetadata([
				{
					code: "200",
					information: "json",
					body: DDataStructure.number(),
				},
				{
					code: "200",
					information: "text",
					body: DDataStructure.string(),
				},
				{
					code: "200",
					information: "text-again",
					body: DDataStructure.literal("hello"),
				},
				{
					code: "200",
					information: "empty",
				},
			]));
		const { result } = render(route);
		expect(result.responses["200"]?.content).toStrictEqual({
			"application/json": { schema: { $ref: "#/components/schemas/NotIdentified0" } },
			"text/plain": { schema: { anyOf: [{ $ref: "#/components/schemas/NotIdentified1" }, { $ref: "#/components/schemas/NotIdentified2" }] } },
		});
		expect(result.responses["200"]?.headers.information.description).toBe("json | text | text-again | empty");
	});

	it("documents and merges SSE, binary and text streams under the same code", () => {
		const route = useRouteBuilder("GET", "/test")
			.handler((floor, { response }) => response.noContent("done"), OpenApiEndpointContractMetadata([
				{
					type: "serverSentEvents",
					code: "200",
					information: "events",
					events: {
						message: DDataStructure.string(),
						ping: DDataStructure.number(),
					},
				},
				{
					type: "serverSentEvents",
					code: "200",
					information: "events",
					events: { message: DDataStructure.boolean() },
				},
				{
					type: "stream",
					code: "200",
					information: "binary",
				},
				{
					type: "stream",
					code: "200",
					information: "binary-again",
				},
				{
					type: "streamText",
					code: "200",
					information: "text",
					flux: DDataStructure.string(),
				},
				{
					type: "streamText",
					code: "200",
					information: "text-again",
					flux: DDataStructure.string(),
				},
			]));
		const { result } = render(route);
		expect(result.responses["200"]?.content).toStrictEqual({
			"text/event-stream": { itemSchema: { anyOf: [{ $ref: "#/components/schemas/NotIdentified0" }, { $ref: "#/components/schemas/NotIdentified1" }] } },
			"application/octet-stream": {
				schema: {
					anyOf: [
						{
							type: "string",
							format: "binary",
						},
						{
							type: "string",
							format: "binary",
						},
					],
				},
			},
			"text/plain": { schema: { anyOf: [{ $ref: "#/components/schemas/NotIdentified2" }, { $ref: "#/components/schemas/NotIdentified3" }] } },
		});
	});

	it("skips empty event definitions", () => {
		const route = useRouteBuilder("GET", "/test")
			.handler((floor, { response }) => response.noContent("done"), OpenApiEndpointContractMetadata({
				type: "serverSentEvents",
				code: "200",
				information: "empty",
				events: {},
			}));
		expect(render(route).result.responses).toStrictEqual({});
	});

	it("documents input parameters, optional values and process extractions", () => {
		const process = useProcessBuilder().extract({ headers: { token: DDataStructure.string() } }).exports();
		const route = useRouteBuilder("POST", ["/test/{id}", "/alias/{id}"])
			.exec(process)
			.extract({
				params: { id: DDataStructure.string() },
				query: { page: DDataStructure.optional(DDataStructure.number()) },
				body: DDataStructure.object({ name: DDataStructure.string() }),
			})
			.handler((floor, { response }) => response.noContent("done"));
		const { result } = render(route);
		expect(result.method).toBe("post");
		expect(result.parameters).toStrictEqual([
			{
				name: "token",
				in: "header",
				required: true,
				schema: { $ref: "#/components/schemas/NotIdentified0" },
			},
			{
				name: "id",
				in: "path",
				required: true,
				schema: { $ref: "#/components/schemas/NotIdentified1" },
			},
			{
				name: "page",
				in: "query",
				required: false,
				schema: { $ref: "#/components/schemas/NotIdentified2" },
			},
		]);
		expect(result.requestBody).toStrictEqual({
			required: true,
			content: { "application/json": { schema: { $ref: "#/components/schemas/NotIdentified3" } } },
		});
		const paths = routeToOpenApi(route, {
			contextToJsonSchemaFactory: new Map(),
			resultSchemaContext: new Map(),
		});
		expect(paths).toHaveLength(2);
		expect(paths[1]).toHaveProperty("path", "/alias/{id}");
	});

	it("documents primitive request bodies", () => {
		const route = useRouteBuilder("POST", "/test")
			.extract({ body: DDataStructure.string() })
			.handler((floor, { response }) => response.noContent("done"));
		expect(
			render(
				route,
			).result.requestBody,
		).toHaveProperty(
			"content.text/plain.schema.$ref",
			"#/components/schemas/NotIdentified0",
		);
	});

	it("documents form-data request bodies", () => {
		const route = useRouteBuilder("POST", "/test", { bodyController: controlBodyAsFormData({ maxFileQuantity: 1 }) })
			.extract({ body: DDataStructure.object({ file: DSDataStructure.file() }) })
			.handler((floor, { response }) => response.noContent("done"));
		expect(
			render(
				route,
			).result.requestBody,
		).toHaveProperty(
			"content.multipart/form-data.schema.$ref",
			"#/components/schemas/NotIdentified0",
		);
	});

	it("excludes ignored routes", () => {
		const route = useRouteBuilder("GET", "/test", { metadata: [IgnoreByOpenApiGeneratorMetadata()] })
			.handler((floor, { response }) => response.noContent("done"));
		expect(routeToOpenApi(route, {
			contextToJsonSchemaFactory: new Map(),
			resultSchemaContext: new Map(),
		})).toStrictEqual([]);
	});
});
