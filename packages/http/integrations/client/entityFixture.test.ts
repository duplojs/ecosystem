import { hub } from "@core";
import { EntityFixture } from "@routes/entityFixture";
import { type FindRouteContract } from "@duplojs/http";
import { createHttpClient, type RouteContractToClientRequestParams } from "@duplojs/http/client";
import { createHttpServer } from "@duplojs/http/node";
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import type * as DNumber from "@duplojs/lang/number";
import type * as DString from "@duplojs/lang/string";
import * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";
import { type Routes } from "./clientType";

describe("client", async() => {
	const server = await createHttpServer(hub, {
		host: "127.0.0.1",
		port: 0,
		uploadFolder: DPath.resolveRelative([DSPath.createAbsoluteOrThrow(import.meta.dirname), DCommon.cast("../files/upload")]),
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Expected a listening TCP server");
	}
	const baseUrl = `http://127.0.0.1:${address.port}`;
	const httpClient = createHttpClient<Routes>({ baseUrl });

	afterAll(() => server.close());

	describe("entity fixture", () => {
		type NewRoute = FindRouteContract<Routes, "POST", "/entity-fixture/new">;
		type MapRoute = FindRouteContract<Routes, "POST", "/entity-fixture/map">;
		type NewBody = RouteContractToClientRequestParams<NewRoute>["body"];
		type MapBody = RouteContractToClientRequestParams<MapRoute>["body"];

		interface PlainNode {
			readonly label: string;
			readonly children: readonly PlainNode[];
		}

		type JsonNode = DModeling.ObjectTag<"EntityFixtureNode"> & {
			readonly label: string;
			readonly children: readonly JsonNode[];
		};

		type _NewBody = DCommon.ExpectType<
			NewBody,
			{
				readonly id: string & DModeling.NewType<"EntityFixtureId", DString.Uuid>;
				readonly name: string & DModeling.NewType<"EntityFixtureName", DString.MinCharacters<3> | DString.MaxCharacters<80>>;
				readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
				readonly createdAt: DChrono.TheDate & DModeling.NewType<"EntityFixtureCreatedAt">;
				readonly duration: DChrono.TheTime & DModeling.NewType<"EntityFixtureDuration">;
				readonly tree: DModeling.ObjectTag<"EntityFixtureNode"> & {
					readonly label: string;
					readonly children: readonly JsonNode[];
				};
			},
			"strict"
		>;
		type _MapBody = DCommon.ExpectType<
			MapBody,
			{
				readonly id: string;
				readonly name: string;
				readonly priority: number;
				readonly createdAt: DChrono.TheDate;
				readonly duration: DChrono.TheTime;
				readonly tree: {
					readonly label: string;
					readonly children: readonly PlainNode[];
				};
			},
			"strict"
		>;

		const createdAt = DChrono.createDateOrThrow(1704067200000);
		const duration = DChrono.createTimeOrThrow(3_661_007);
		const id = "123e4567-e89b-42d3-a456-426614174000";
		const rawTree = {
			label: "root",
			children: [
				{
					label: "child",
					children: [],
				},
			],
		};
		const node = EntityFixture.Node.new({
			label: "root",
			children: [
				EntityFixture.Node.new({
					label: "child",
					children: [],
				}),
			],
		});
		const newBody = {
			id: DEither.unwrapByInformationOrThrow(EntityFixture.Id.map(id), "map-success"),
			name: DEither.unwrapByInformationOrThrow(EntityFixture.Name.map("Example"), "map-success"),
			priority: DEither.unwrapByInformationOrThrow(EntityFixture.Priority.map(3), "map-success"),
			createdAt: DEither.unwrapByInformationOrThrow(EntityFixture.CreatedAt.map(createdAt), "map-success"),
			duration: DEither.unwrapByInformationOrThrow(EntityFixture.Duration.map(duration), "map-success"),
			tree: node,
		} satisfies NewBody;
		const mapBody = {
			id,
			name: "Example",
			priority: 8,
			createdAt,
			duration,
			tree: rawTree,
		} satisfies MapBody;
		const jsonTree = {
			label: "root",
			children: [
				{
					label: "child",
					children: [],
					[DModeling.objectTagKind.runTimeKey]: "EntityFixtureNode",
				},
			],
			[DModeling.objectTagKind.runTimeKey]: "EntityFixtureNode",
		};

		it("sends validated newtypes and a tagged tree, and receives a JSON entity", async() => {
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			try {
				const result = await httpClient.post("/entity-fixture/new", { body: newBody })
					.iWantInformationOrThrow("entity-fixture.created");

				type _Response = DCommon.ExpectType<
					Pick<typeof result, "code" | "information" | "body">,
					{
						code: "200";
						information: "entity-fixture.created";
						body: (
							& DModeling.Entity<"EntityFixture">
							& {
								readonly id: string & DModeling.NewType<"EntityFixtureId", DString.Uuid>;
								readonly name: string & DModeling.NewType<"EntityFixtureName", DString.MinCharacters<3> | DString.MaxCharacters<80>>;
								readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
								readonly createdAt: `date${number}+` | `date${number}-`;
								readonly duration: `time${number}+` | `time${number}-`;
								readonly tree: DModeling.ObjectTag<"EntityFixtureNode"> & {
									readonly label: string;
									readonly children: readonly JsonNode[];
								};
							}
						);
					},
					"strict"
				>;

				expect(fetchSpy).toHaveBeenCalledWith(
					`${baseUrl}/entity-fixture/new`,
					expect.objectContaining({
						body: JSON.stringify({
							id,
							name: "Example",
							priority: 3,
							createdAt: "date1704067200000+",
							duration: "time3661007+",
							tree: jsonTree,
						}),
					}),
				);
				expect(result.code).toBe("200");
				expect(result.body).toStrictEqual({
					id,
					name: "Example",
					priority: 3,
					createdAt: "date1704067200000+",
					duration: "time3661007+",
					tree: jsonTree,
					[DModeling.entityKind.runTimeKey]: "EntityFixture",
				});
			} finally {
				fetchSpy.mockRestore();
			}
		});

		it("maps plain values and returns a flagged entity", async() => {
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			try {
				const result = await httpClient.post("/entity-fixture/map", { body: mapBody })
					.iWantInformationOrThrow("entity-fixture.high-priority");

				type _Response = DCommon.ExpectType<
					Pick<typeof result, "code" | "information" | "body">,
					{
						code: "201";
						information: "entity-fixture.high-priority";
						body: (
							& DModeling.Entity<"EntityFixture">
							& {
								readonly id: string & DModeling.NewType<"EntityFixtureId", DString.Uuid>;
								readonly name: string & DModeling.NewType<"EntityFixtureName", DString.MinCharacters<3> | DString.MaxCharacters<80>>;
								readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
								readonly createdAt: `date${number}+` | `date${number}-`;
								readonly duration: `time${number}+` | `time${number}-`;
								readonly tree: DModeling.ObjectTag<"EntityFixtureNode"> & {
									readonly label: string;
									readonly children: readonly JsonNode[];
								};
							}
							& DModeling.Flag<
								"HighPriority",
								& number
								& DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>
								& DNumber.GreaterThanOrEqual<6>
							>
						);
					},
					"strict"
				>;

				expect(fetchSpy).toHaveBeenCalledWith(
					`${baseUrl}/entity-fixture/map`,
					expect.objectContaining({
						body: JSON.stringify({
							id,
							name: "Example",
							priority: 8,
							createdAt: "date1704067200000+",
							duration: "time3661007+",
							tree: rawTree,
						}),
					}),
				);
				expect(result.code).toBe("201");
				expect(result.body).toStrictEqual({
					id,
					name: "Example",
					priority: 8,
					createdAt: "date1704067200000+",
					duration: "time3661007+",
					tree: jsonTree,
					[DModeling.entityKind.runTimeKey]: "EntityFixture",
					[DModeling.flagKind.runTimeKey]: { HighPriority: 8 },
				});
			} finally {
				fetchSpy.mockRestore();
			}
		});

		it("returns a flagged entity from the new route for a high priority", async() => {
			const priority = DEither.unwrapByInformationOrThrow(EntityFixture.Priority.map(8), "map-success");
			const result = await httpClient.post("/entity-fixture/new", {
				body: {
					...newBody,
					priority,
				},
			}).iWantInformationOrThrow("entity-fixture.high-priority");

			type _Response = DCommon.ExpectType<
				Pick<typeof result, "code" | "information" | "body">,
				{
					code: "201";
					information: "entity-fixture.high-priority";
					body: (
						& DModeling.Entity<"EntityFixture">
						& {
							readonly id: string & DModeling.NewType<"EntityFixtureId", DString.Uuid>;
							readonly name: string & DModeling.NewType<"EntityFixtureName", DString.MinCharacters<3> | DString.MaxCharacters<80>>;
							readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
							readonly createdAt: `date${number}+` | `date${number}-`;
							readonly duration: `time${number}+` | `time${number}-`;
							readonly tree: DModeling.ObjectTag<"EntityFixtureNode"> & {
								readonly label: string;
								readonly children: readonly JsonNode[];
							};
						}
						& DModeling.Flag<
							"HighPriority",
							& number
							& DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>
							& DNumber.GreaterThanOrEqual<6>
						>
					);
				},
				"strict"
			>;
			expect(result.code).toBe("201");
			expect(result.body).toStrictEqual({
				id,
				name: "Example",
				priority: 8,
				createdAt: "date1704067200000+",
				duration: "time3661007+",
				tree: jsonTree,
				[DModeling.entityKind.runTimeKey]: "EntityFixture",
				[DModeling.flagKind.runTimeKey]: { HighPriority: 8 },
			});
		});

		it("returns an unflagged entity from the map route for a lower priority", async() => {
			const result = await httpClient.post("/entity-fixture/map", {
				body: {
					...mapBody,
					priority: 3,
				},
			}).iWantInformationOrThrow("entity-fixture.created");

			type _Response = DCommon.ExpectType<
				Pick<typeof result, "code" | "information" | "body">,
				{
					code: "200";
					information: "entity-fixture.created";
					body: (
						& DModeling.Entity<"EntityFixture">
						& {
							readonly id: string & DModeling.NewType<"EntityFixtureId", DString.Uuid>;
							readonly name: string & DModeling.NewType<"EntityFixtureName", DString.MinCharacters<3> | DString.MaxCharacters<80>>;
							readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
							readonly createdAt: `date${number}+` | `date${number}-`;
							readonly duration: `time${number}+` | `time${number}-`;
							readonly tree: DModeling.ObjectTag<"EntityFixtureNode"> & {
								readonly label: string;
								readonly children: readonly JsonNode[];
							};
						}
					);
				},
				"strict"
			>;
			expect(result.code).toBe("200");
			expect(result.body).toStrictEqual({
				id,
				name: "Example",
				priority: 3,
				createdAt: "date1704067200000+",
				duration: "time3661007+",
				tree: jsonTree,
				[DModeling.entityKind.runTimeKey]: "EntityFixture",
			});
		});

		it.each([
			{
				field: "id",
				body: {
					...mapBody,
					id: "invalid",
				},
				code: "422",
				reason: "map-error",
			},
			{
				field: "name",
				body: {
					...mapBody,
					name: "ab",
				},
				code: "422",
				reason: "map-error",
			},
			{
				field: "priority",
				body: {
					...mapBody,
					priority: 11,
				},
				code: "422",
				reason: "map-error",
			},
		])("rejects an invalid $field during entity mapping", async({ body, code, reason }) => {
			const result = await httpClient.post("/entity-fixture/map", {
				body,
			}).iWantInformationOrThrow("entity-fixture.mapping-failed");

			type _Response = DCommon.ExpectType<
				Pick<typeof result, "code" | "information" | "body">,
				{
					code: "422";
					information: "entity-fixture.mapping-failed";
					body: { readonly reason: "async-error" | "map-error" };
				},
				"strict"
			>;
			expect(result.code).toBe(code);
			expect(result.body).toStrictEqual({ reason });
		});

		it("rejects a tree without tagged nodes on the new route", async() => {
			const result = await httpClient.post("/entity-fixture/new", {
				body: {
					...newBody,
					// @ts-expect-error The new route requires an already tagged recursive tree.
					tree: rawTree,
				},
			}).iWantInformationOrThrow("extract-error");

			type _Response = DCommon.ExpectType<
				Pick<typeof result, "code" | "information" | "body">,
				{
					code: "422";
					information: "extract-error";
					body: string;
				},
				"strict"
			>;
			expect(result.code).toBe("422");
			expect(result.headers.get("extract-key")).toBe("request.body");
		});

		it("rejects an untagged child inside a tagged tree", async() => {
			const root = EntityFixture.Node.new({
				label: "root",
				// @ts-expect-error Every recursive child must have the node tag.
				children: rawTree.children,
			});
			const result = await httpClient.post("/entity-fixture/new", {
				body: {
					...newBody,
					tree: root,
				},
			}).iWantInformationOrThrow("extract-error");

			expect(result.code).toBe("422");
			expect(result.headers.get("extract-key")).toBe("request.body");
		});
	});
});
