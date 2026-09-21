import { controlBodyAsFormData, defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";
import { bodyAsFormData, convertRoutePath, IgnoreByCodeGeneratorMetadata, routeToStructure } from "@plugin-codeGenerator";
import { DataStructureToTypescript } from "@duplojs/tools";
import { fileTransformer } from "@plugin-codeGenerator/typescriptTransformer";
import * as DSDataStructure from "@duplojs/server/dataStructure";

describe("routeToStructure", () => {
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

	it("expect good result", () => {
		const result = routeToStructure(route, { defaultExtractContract });

		expect(omitFunctions(result)).toStrictEqual([
			omitFunctions(
				DDataStructure.object({
					method: DDataStructure.literal("GET"),
					path: DDataStructure.literal("/test"),
					body: DDataStructure.object({
						prop1: DDataStructure.string(),
						prop2: DDataStructure.number(),
					}),
					headers: DDataStructure.object({
						header3: DDataStructure.string(),
						header4: DDataStructure.number(),
						header1: DDataStructure.string(),
						header2: DDataStructure.number(),
					}),
					query: DDataStructure.string(),
					responses: DDataStructure.union([
						DDataStructure.object({
							code: DDataStructure.literal(defaultExtractContract.code),
							information: DDataStructure.literal(defaultExtractContract.information),
							body: DDataStructure.undefined(),
						}),
						DDataStructure.object({
							code: DDataStructure.literal("404"),
							information: DDataStructure.literal("notFound"),
							body: DDataStructure.undefined(),
						}),
						DDataStructure.object({
							code: DDataStructure.literal("204"),
							information: DDataStructure.literal("test"),
							body: DDataStructure.undefined(),
						}),
						DDataStructure.object({
							code: DDataStructure.literal(defaultExtractContract.code),
							information: DDataStructure.literal(defaultExtractContract.information),
							body: DDataStructure.undefined(),
						}),
						DDataStructure.object({
							code: DDataStructure.literal(defaultExtractContract.code),
							information: DDataStructure.literal(defaultExtractContract.information),
							body: DDataStructure.undefined(),
						}),
					]),
				}),
			),
		]);
	});

	it("ignored route", () => {
		const route = useRouteBuilder("GET", "/test", { metadata: [IgnoreByCodeGeneratorMetadata()] })
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const result = routeToStructure(
			route,
			{ defaultExtractContract },
		);

		expect(result).toStrictEqual([]);
	});

	it("convertRoutePath", () => {
		expect(
			omitFunctions(
				[
					convertRoutePath("/test/*"),
					convertRoutePath("/test"),
					convertRoutePath("/test-*/ok"),
				],
			),
		).toStrictEqual(
			omitFunctions([
				DDataStructure.string(),
				DDataStructure.literal("/test"),
				DDataStructure.string(),
			]),
		);
	});

	it("", () => {
		const route = useRouteBuilder("GET", "/test", { bodyController: controlBodyAsFormData({ maxFileQuantity: 1 }) })
			.extract({
				body: DDataStructure.object({
					test: DDataStructure.string(),
				}),
			})
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const result = routeToStructure(
			route,
			{ defaultExtractContract },
		);

		expect(
			(result as any)[0]?.definition.shape.body.definition.overrideTypescriptTransformer,
		).toStrictEqual(bodyAsFormData);
	});

	it("bodyAsFormData", () => {
		expect(
			DataStructureToTypescript.render(
				DDataStructure.array(DSDataStructure.file()).addOverrideTypescriptTransformer(bodyAsFormData),
				{
					identifier: "ArrayString",
					typeTransformers: [fileTransformer, ...DataStructureToTypescript.defaultTypeTransformers],
					constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
					structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
				},
			),
		).toMatchSnapshot();

		expect(
			bodyAsFormData(DSDataStructure.file(), { transformer: () => DEither.left("test", undefined) } as never),
		).toStrictEqual(DEither.left("test", undefined));
	});
});
