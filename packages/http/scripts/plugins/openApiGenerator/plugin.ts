import type { HubPlugin } from "@core/hub";
import { type DataStructureToJsonSchema } from "@duplojs/tools";
import { routeToOpenApi, type ResultSchemaContext } from "./routeToOpenApi";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DObject from "@duplojs/lang/object";
import * as DPattern from "@duplojs/lang/pattern";
import { makeOpenApiPage } from "./makeOpenApiPage";
import { makeOpenApiRoute } from "./makeOpenApiRoute";
import type { RoutePath } from "@core/route";
import type { OpenApiDocument } from "./types/openApiDocument";
import type { OpenApiSecuritySchema, SupportedBearerFormat } from "./types";
import * as DSFile from "@duplojs/server/file";
import type * as DPath from "@duplojs/lang/path";

interface OpenApiSecurityOptionBearer {
	type: "bearer";
	bearerFormat?: SupportedBearerFormat;
}

interface OpenApiSecurityOptionApiKey {
	type: "apiKey";
	paramName: string;
	in: "header" | "query" | "cookie";
}

interface OpenApiSecurityOptionBasic {
	type: "basic";
}

export interface OpenApiGeneratorPluginParams {
	routePath?: RoutePath;
	outputFile?: string & DPath.Path;

	/**
	 * @default "Swagger API"
	 */
	title?: string;

	/**
	 * @default "0.0.0"
	 */
	version?: string;
	summary?: string;
	contact?: {
		name?: string;
		email?: string;
		url?: string;
	};
	license?: {
		name: string;
		url?: string;
		identifier?: string;
	};
	security?:
		| OpenApiSecurityOptionBearer
		| OpenApiSecurityOptionApiKey
		| OpenApiSecurityOptionBasic;
	servers?: {
		url: string;
		description?: string;
	}[];

	/**
	 * @default "5.31.0"
	 */
	swaggerUiVersion?: string;
}

export function openApiGeneratorPlugin(pluginParams: OpenApiGeneratorPluginParams) {
	return (): HubPlugin => ({
		name: "open-api-generator",
		hooksHubLifeCycle: [
			{
				beforeServerBuildRoutes: async(hub) => {
					if (
						!DCommon.equal(hub.config.environment, ["DEV", "BUILD"])
						|| (
							!pluginParams.routePath
							&& !pluginParams.outputFile
						)
					) {
						return;
					}

					const contextToJsonSchemaFactory: DataStructureToJsonSchema.MapContext = new Map();
					const resultSchemaContext: ResultSchemaContext = new Map();
					const routes = DArray.from(hub.routes);

					const openApiRoutes = DCommon.pipe(
						routes,
						DArray.filter((route) => route.definition.method !== "OPTIONS"),
						DArray.flatMap(
							(route) => routeToOpenApi(route, {
								defaultExtractContract: hub.defaultExtractContract,
								resultSchemaContext,
								contextToJsonSchemaFactory,
							}),
						),
					);

					if (!DArray.minElements(openApiRoutes, 1)) {
						return;
					}

					const paths = DCommon.pipe(
						openApiRoutes,
						DArray.group(
							(element, { output }) => output(element.path, element),
						),
						DObject.entries,
						DArray.filter((entry) => entry[1] !== undefined),
						DArray.map(
							([path, value]) => DCommon.pipe(
								value,
								DArray.group(
									({ method, path, ...rest }, { output }) => output(
										method,
										rest,
									),
								),
								DObject.entries,
								DArray.filter((entry) => entry[1] !== undefined),
								DArray.map(
									([method, value]) => DObject.entry(
										method,
										DArray.first(value),
									),

								),
								DObject.fromEntries,
								(value) => DObject.entry(path, value),
							),
						),
						DObject.fromEntries,
					);

					const schemaComponents = DGenerator.reduce(
						resultSchemaContext.values(),
						DGenerator.reduceFrom<Record<string, DataStructureToJsonSchema.JsonSchema>>({}),
						({ lastValue, item, nextWithObject }) => nextWithObject(
							lastValue,
							item,
						),
					);

					const securityScheme: OpenApiSecuritySchema | undefined = DPattern.match(
						pluginParams.security,
					)
						.with(
							{ type: "bearer" },
							(security) => (<const>{
								type: "http",
								scheme: "bearer",
								bearerFormat: security.bearerFormat ?? "JWT",
							}),
						)
						.with(
							{ type: "basic" },
							DCommon.justReturn(<const>{
								type: "http",
								scheme: "basic",
							}),
						)
						.with(
							{ type: "apiKey" },
							(security) => ({
								type: <const>"apiKey",
								name: security.paramName,
								in: security.in,
							}),
						)
						.otherwise(DCommon.justReturn(undefined));

					const securitySchemeName = "auth";

					const securitySchemes = securityScheme
						? {
							[securitySchemeName]: securityScheme,
						}
						: undefined;

					const openApiDocument: OpenApiDocument = {
						openapi: "3.1.0",
						info: {
							title: pluginParams.title ?? "Swagger API",
							version: pluginParams.version ?? "0.0.0",
							summary: pluginParams.summary,
							contact: pluginParams.contact,
							license: pluginParams.license,
						},
						servers: pluginParams.servers,
						paths,
						components: {
							schemas: schemaComponents,
							securitySchemes,
						},
						security: pluginParams.security
							? [
								{
									[securitySchemeName]: [],
								},
							]
							: undefined,
					};

					const openApiDocumentString = JSON.stringify(openApiDocument, null, 2);

					if (pluginParams.outputFile) {
						DCommon.asserts(
							await DSFile.writeTextFile(pluginParams.outputFile, openApiDocumentString),
							DEither.isRight,
						);
					}

					if (pluginParams.routePath) {
						const openApiPage = makeOpenApiPage({
							openApiDocument: openApiDocumentString,
							pageTitle: pluginParams.title ?? "Swagger API",
							swaggerUiVersion: pluginParams.swaggerUiVersion ?? "5.31.0",
						});

						const openApiRoute = makeOpenApiRoute(
							pluginParams.routePath,
							openApiPage,
						);

						return hub.register(openApiRoute);
					}

					return;
				},
			},
		],
	});
}
