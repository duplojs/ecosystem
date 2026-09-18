import { createPresetChecker, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { findIdentifiedStructureInSteps } from "@plugin-codeGenerator/findIdentifiedStructureInSteps";
import { testChecker } from "@test-utils/checker";

describe("findIdentifiedStructureInSteps", () => {
	it("finds only identified data parsers from extract steps", () => {
		const structure1 = DDataStructure.string().setIdentifier("extractNested");
		const structure2 = DDataStructure.string().setIdentifier("extractHeader");
		const structure3 = DDataStructure.string().setIdentifier("extractQuery");

		const extractBody = DDataStructure.object({
			nested: structure1,
			ignored: DDataStructure.number(),
		});

		const route = useRouteBuilder("GET", "/test")
			.extract({
				body: extractBody,
				headers: structure2,
				query: {
					search: structure3,
					page: DDataStructure.number(),
				},
			})
			.handler(
				ResponseContract.noContent("extract.ok"),
				(__, { response }) => response("extract.ok"),
			);

		const result = findIdentifiedStructureInSteps(
			route.definition.steps,
			{ ignoreStructure: new Set() },
		);

		expect(result).toStrictEqual([
			structure1,
			structure2,
			structure3,
		]);
	});

	it("finds identified data parsers from handler response contracts", () => {
		const extractErrorBody = DDataStructure.string().setIdentifier("extractErrorBody");

		const route = useRouteBuilder("GET", "/test")
			.extract(
				{ body: DDataStructure.number() },
			)
			.handler(
				[
					ResponseContract.badRequest("extract.invalid", extractErrorBody),
					ResponseContract.noContent("extract.ok"),
				],
				(__, { response }) => response("extract.ok"),
			);

		const result = findIdentifiedStructureInSteps(
			route.definition.steps,
			{ ignoreStructure: new Set() },
		);

		expect(result).toStrictEqual([extractErrorBody]);
	});

	it("finds only identified data parsers from step response contracts", () => {
		const presetBody = DDataStructure.string().setIdentifier("presetBody");

		const presetChecker = createPresetChecker(
			testChecker,
			{
				result: "info",
				otherwise: ResponseContract.badRequest("preset.invalid", presetBody),
			},
		);

		const structure1 = DDataStructure.undefined().setIdentifier("checkerBody");
		const structure2 = DDataStructure.string().setIdentifier("cutBody");
		const structure3 = DDataStructure.string().setIdentifier("handlerBody");

		const route = useRouteBuilder("GET", "/test")
			.extract({ body: DDataStructure.string() })
			.check(
				testChecker,
				{
					input: () => "",
					result: "info",
					otherwise: ResponseContract.badRequest(
						"checker.invalid",
						structure1,
					),
				},
			)
			.cut(
				ResponseContract.conflict("cut.conflict", structure2),
				(__, { response }) => response("cut.conflict", ""),
			)
			.presetCheck(presetChecker, () => "")
			.handler(
				ResponseContract.ok(
					"handler.ok",
					DDataStructure.object({
						kept: structure3,
						ignored: DDataStructure.number(),
					}),
				),
				(__, { response }) => response("handler.ok", {
					kept: "",
					ignored: 1,
				}),
			);

		const result = findIdentifiedStructureInSteps(
			route.definition.steps,
			{ ignoreStructure: new Set() },
		);

		expect(result).toStrictEqual([
			structure1,
			structure2,
			presetBody,
			structure3,
		]);
	});

	it("walks nested process steps and ignores already visited data parsers", () => {
		const sharedStructure = DDataStructure.string().setIdentifier("sharedStructure");

		const process = useProcessBuilder()
			.extract({ body: sharedStructure })
			.cut(
				ResponseContract.conflict("process.conflict", sharedStructure),
				(__, { response }) => response("process.conflict", ""),
			)
			.exports();

		const route = useRouteBuilder("GET", "/test")
			.exec(process)
			.handler(
				ResponseContract.ok("route.ok", sharedStructure),
				(__, { response }) => response("route.ok", ""),
			);

		const result = findIdentifiedStructureInSteps(
			route.definition.steps,
			{ ignoreStructure: new Set() },
		);

		expect(result).toStrictEqual([sharedStructure]);
	});
});
