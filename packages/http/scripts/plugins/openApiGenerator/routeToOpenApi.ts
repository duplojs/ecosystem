import type { Route } from "@core/route";
import { aggregateStepContract, type AggregateStepsParams } from "./aggregateStepContract";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DObject from "@duplojs/lang/object";
import * as DPattern from "@duplojs/lang/pattern";
import * as DString from "@duplojs/lang/string";
import { DataStructureToJsonSchema } from "@duplojs/tools";
import { FormDataBodyController, type RequestMethods } from "@core/request";
import type { EndpointResponse, EndpointResponseContent, EntrypointParameter, OpenApiMethod } from "./types";
import { IgnoreByOpenApiGeneratorMetadata, type OpenApiEndpointContractMetadata } from "./metadata";

export type ResultSchemaContext = Map<string, Record<string, DataStructureToJsonSchema.JsonSchema>>;

export interface RouteToOpenApiParams {
	readonly defaultExtractMetadata?: ReturnType<typeof OpenApiEndpointContractMetadata>;
	readonly contextToJsonSchemaFactory: DataStructureToJsonSchema.MapContext;
	readonly resultSchemaContext: ResultSchemaContext;
}

interface FactoryParams {
	context: DataStructureToJsonSchema.MapContext;
	resultSchemaContext: ResultSchemaContext;
	schema: DDataStructure.Structure;
}

function factoryJsonSchema(params: FactoryParams) {
	const identifier = params.schema.definition.identifier
		?? `NotIdentified${params.resultSchemaContext.size}`;

	const renderResult = DataStructureToJsonSchema.render(
		params.schema,
		{
			identifier,
			context: params.context,
			version: "openApi31",
			structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
			typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
		},
	);

	params.resultSchemaContext.set(identifier, renderResult.components.schemas);

	return DObject.pick(renderResult, { $ref: true });
}

const parameterKeyMapper = {
	query: "query",
	params: "path",
	headers: "header",
} as const;

const methodMapper = {
	GET: "get",
	POST: "post",
	PUT: "put",
	DELETE: "delete",
	HEAD: "head",
	TRACE: "trace",
	CONNECT: "connect",
	OPTIONS: "options",
	PATCH: "patch",
} as const satisfies Record<RequestMethods, OpenApiMethod>;

export function routeToOpenApi(
	route: Route,
	params: RouteToOpenApiParams,
) {
	const isIgnore = DArray.find(
		route.definition.metadata,
		IgnoreByOpenApiGeneratorMetadata.is,
	);

	if (isIgnore) {
		return [];
	}

	const aggregateStepResult = aggregateStepContract(
		[
			...route.definition.preflightSteps,
			...route.definition.steps,
		],
		{
			metadata: route.definition.metadata,
			defaultExtractMetadata: params.defaultExtractMetadata,
		},
	);

	const { body, ...restEntrypoint } = aggregateStepResult.entrypointContract;

	const parameters = DCommon.pipe(
		restEntrypoint,
		DObject.entries,
		DArray.select(
			(
				{ element: [key, value], select, skip },
			) => !DDataStructure.structureKind.has(value) && DObject.countKeys(value)
				? select(DObject.entry(key, DObject.entries(value)))
				: skip(),
		),
		DArray.flatMap(
			([key, value]) => DArray.map(
				value,
				([name, schema]): EntrypointParameter => ({
					name,
					in: parameterKeyMapper[key],
					required: !DDataStructure.isOptional(schema),
					schema: factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						schema,
					}),
				}),
			),
		),
	);

	const requestBody = DCommon.pipe(
		body,
		DCommon.when(
			(value) => DObject.countKeys(value) === 0,
			DCommon.justReturn(DDataStructure.undefined()),
		),
		DCommon.whenNot(
			DDataStructure.structureKind.has,
			DDataStructure.object,
		),
		DPattern.when(
			DDataStructure.isUndefinedStructure,
			DCommon.justReturn(undefined),
		),
		DPattern.when(
			() => FormDataBodyController.is(route.definition.bodyController),
			(objectSchema) => ({
				required: <const>true,
				content: {
					"multipart/form-data": {
						schema: factoryJsonSchema({
							context: params.contextToJsonSchemaFactory,
							resultSchemaContext: params.resultSchemaContext,
							schema: objectSchema,
						}),
					},
				},
			}),
		),
		DPattern.when(
			DDataStructure.structureIdentifier(DDataStructure.objectStructureKind),
			(objectSchema) => ({
				required: <const>true,
				content: {
					"application/json": {
						schema: factoryJsonSchema({
							context: params.contextToJsonSchemaFactory,
							resultSchemaContext: params.resultSchemaContext,
							schema: objectSchema,
						}),
					},
				},
			}),
		),
		DPattern.otherwise(
			(primitiveSchema) => ({
				required: <const>true,
				content: {
					"text/plain": {
						schema: factoryJsonSchema({
							context: params.contextToJsonSchemaFactory,
							resultSchemaContext: params.resultSchemaContext,
							schema: primitiveSchema,
						}),
					},
				},
			}),
		),
	);

	const responses = DCommon.pipe(
		aggregateStepResult.endpointContract,
		DArray.reduce(
			DArray.reduceFrom<
				Partial<
					Record<
						string,
						EndpointResponse
					>
				>
			>({}),
			({ lastValue, element: contract, nextWithObject, next }) => {
				const { information, code } = contract;
				const description = contract.description ?? lastValue[code]?.description ?? information;

				const headerInformation: DataStructureToJsonSchema.JsonSchema = {
					const: information,
					type: "string",
				};

				const headerDescription = DPattern.match(lastValue[code])
					.when(
						DCommon.isType("object"),
						(value) => {
							if (DString.includes(value.headers.information.description, information)) {
								return value.headers.information.description;
							}
							return DString.concat(
								value.headers.information.description,
								" | ",
								information,
							);
						},
					)
					.when(
						DCommon.isType("undefined"),
						DCommon.justReturn(information),
					)
					.exhaustive();

				const headers: EndpointResponse["headers"] = {
					information: {
						schema: lastValue[code]
							? {
								anyOf: [
									lastValue[code].headers.information.schema,
									headerInformation,
								],
							}
							: headerInformation,
						description: headerDescription,
					},
				};

				if (contract.type === "serverSentEvents") {
					const eventNameList = DObject.keys(contract.events);
					const eventDataList = DObject.values(contract.events);
					if (!DArray.minElements(eventNameList, 1) || !DArray.minElements(eventDataList, 1)) {
						return next(lastValue);
					}

					const schema = factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						schema: DDataStructure.object({
							event: DDataStructure.literal(DCommon.cast(eventNameList)),
							data: DDataStructure.union(
								DCommon.cast(eventDataList) satisfies DCommon.AnyTuple<DDataStructure.Structure>,
							),
							id: DDataStructure.optional(DDataStructure.string()),
							retry: DDataStructure.optional(DDataStructure.number()),
						}),
					});

					const lastContent = lastValue[code]?.content;
					const content: EndpointResponseContent = {
						...lastContent,
						"text/event-stream": {
							itemSchema: lastContent?.["text/event-stream"]
								? {
									anyOf: [
										lastContent["text/event-stream"].itemSchema,
										schema,
									],
								}
								: schema,
						},
					};

					return nextWithObject(
						lastValue,
						{
							[code]: {
								description,
								headers,
								content,
							},
						},
					);
				}

				if (contract.type === "stream") {
					const lastContent = lastValue[code]?.content;
					const schema: DataStructureToJsonSchema.JsonSchema = {
						type: "string",
						format: "binary",
					};
					const content: EndpointResponseContent = {
						...lastContent,
						"application/octet-stream": {
							schema: lastContent?.["application/octet-stream"]
								? {
									anyOf: [
										lastContent["application/octet-stream"].schema,
										schema,
									],
								}
								: schema,
						},
					};

					return nextWithObject(
						lastValue,
						{
							[code]: {
								description,
								headers,
								content,
							},
						},
					);
				}

				if (contract.type === "streamText") {
					const lastContent = lastValue[code]?.content;
					const schema = factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						schema: contract.flux,
					});
					const content: EndpointResponseContent = {
						...lastContent,
						"text/plain": {
							schema: lastContent?.["text/plain"]
								? {
									anyOf: [
										lastContent["text/plain"].schema,
										schema,
									],
								}
								: schema,
						},
					};

					return nextWithObject(
						lastValue,
						{
							[code]: {
								description,
								headers,
								content,
							},
						},
					);
				}

				const body = contract.body ?? DDataStructure.undefined();
				const schemaResponse = factoryJsonSchema({
					context: params.contextToJsonSchemaFactory,
					resultSchemaContext: params.resultSchemaContext,
					schema: body,
				});

				const bodyTypes = DDataStructure.structureIdentifier(body, DDataStructure.unionStructureKind)
					? body.definition.values.value
					: [body];
				const contentType = DArray.every(bodyTypes, DCommon.or([
					DDataStructure.typeStructureIdentifier(DDataStructure.stringTypeKind),
					DDataStructure.typeStructureIdentifier(DDataStructure.stringLiteralTypeKind),
				]))
					? "text/plain"
					: "application/json";
				const lastContent = lastValue[code]?.content;
				const previousSchema = lastContent?.[contentType]?.schema;
				const content = DDataStructure.isUndefinedStructure(body)
					? lastContent
					: {
						...lastContent,
						[contentType]: {
							schema: previousSchema
								? { anyOf: [previousSchema, schemaResponse] }
								: schemaResponse,
						},
					};

				return nextWithObject(
					lastValue,
					{
						[code]: {
							description,
							headers,
							content,
						},
					},
				);
			},
		),
	);

	return DArray.map(
		route.definition.paths,
		(path) => ({
			path,
			method: methodMapper[route.definition.method],
			parameters,
			requestBody,
			responses,
		}),
	);
}
