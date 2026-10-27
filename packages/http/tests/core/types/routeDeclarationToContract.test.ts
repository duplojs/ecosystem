import { useRouteBuilder, useProcessBuilder, usePreflightBuilder, useCheckerBuilder, createPresetChecker, controlBodyAsFormData, type RouteDeclarationToContract } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@duplojs/server/dataStructure";

describe("RouteDeclarationToContract", () => {
	it("infers literal responses, methods and wildcard paths without output declarations", () => {
		const route = useRouteBuilder("GET", ["/users/*", "/archive/*/files/*"])
			.handler((floor, { response }) => response.ok("found", {
				id: 42,
				active: true,
			}));
		type Contract = RouteDeclarationToContract<typeof route>;
		type _Path = DCommon.ExpectType<
			Contract["path"],
			`/users/${string}` | `/archive/${string}/files/${string}`,
			"strict"
		>;
		type _Method = DCommon.ExpectType<
			Contract["method"],
			"GET",
			"strict"
		>;
		type _Response = DCommon.ExpectType<
			Contract["responses"],
			{
				readonly code: "200";
				readonly information: "found";
				readonly body: {
					readonly id: 42;
					readonly active: true;
				};
			},
			"strict"
		>;
		type _Keys = DCommon.ExpectType<
			keyof Contract,
			"path" | "method" | "responses",
			"strict"
		>;
		expect(route.definition.paths).toStrictEqual(["/users/*", "/archive/*/files/*"]);
	});

	it("unions checker and preset rejections, asynchronous cuts and the handler", () => {
		const checker = useCheckerBuilder().handler((input: string, { output }) => input
			? output("found", 42)
			: output("missing", null));
		const preset = createPresetChecker(checker, {
			result: "found",
			otherwise: ({ response }) => response.conflict("preset-rejected", "reason"),
		});
		const route = useRouteBuilder("GET", "/test")
			.check(checker, {
				input: () => "value",
				result: "found",
				otherwise: ({ response }) => response.notFound("checker-rejected"),
			})
			.presetCheck(preset, () => "value")
			.cut((floor, { response, output, request }) => Promise.resolve(request.path === "/blocked"
				? response.forbidden("cut-rejected", { blocked: true })
				: output({ value: 42 })))
			.handler((floor, { response }) => Promise.resolve(response.ok("done", floor.value)));
		type Responses = RouteDeclarationToContract<typeof route>["responses"];
		type Expected =
			| {
				readonly code: "404";
				readonly information: "checker-rejected";
				readonly body: undefined;
			}
			| {
				readonly code: "409";
				readonly information: "preset-rejected";
				readonly body: "reason";
			}
			| {
				readonly code: "403";
				readonly information: "cut-rejected";
				readonly body: { readonly blocked: true };
			}
			| {
				readonly code: "200";
				readonly information: "done";
				readonly body: number;
			};
		type _Responses = DCommon.ExpectType<
			Responses,
			Expected,
			"strict"
		>;
		expect(route.definition.steps).toHaveLength(4);
	});

	it("includes responses and input structures from nested preflight processes", () => {
		const inner = useProcessBuilder()
			.extract({ headers: { authorization: DDataStructure.string() } })
			.cut((floor, { response, output }) => floor.authorization
				? output({ authorized: true })
				: response.unauthorized("unauthorized"))
			.exports(["authorized"]);
		const outer = useProcessBuilder().exec(inner, { imports: ["authorized"] }).exports(["authorized"]);
		const preflight = usePreflightBuilder().exec(outer, { imports: ["authorized"] });
		const route = preflight.useRouteBuilder("POST", "/users/{id}")
			.extract({
				params: { id: DDataStructure.number() },
				query: { page: DDataStructure.optional(DDataStructure.number()) },
				body: DDataStructure.object({ name: DDataStructure.string() }),
			})
			.handler((floor, { response }) => response.created("created", floor.body));
		type Contract = RouteDeclarationToContract<typeof route>;
		type _Headers = DCommon.ExpectType<
			Contract["headers"],
			{ readonly authorization: string },
			"strict"
		>;
		type _Params = DCommon.ExpectType<
			Contract["params"],
			{ readonly id: number },
			"strict"
		>;
		type _Query = DCommon.ExpectType<
			Contract["query"],
			{ readonly page: number | undefined },
			"strict"
		>;
		type _Body = DCommon.ExpectType<
			Contract["body"],
			{ readonly name: string },
			"strict"
		>;
		type ExpectedResponses =
			| {
				readonly code: "401";
				readonly information: "unauthorized";
				readonly body: undefined;
			}
			| {
				readonly code: "422";
				readonly information: "extract-error";
				readonly body: Error | undefined;
			}
			| {
				readonly code: "201";
				readonly information: "created";
				readonly body: { readonly name: string };
			};
		type _Responses = DCommon.ExpectType<
			Contract["responses"],
			ExpectedResponses,
			"strict"
		>;
		expect(route.definition.preflightSteps).toHaveLength(1);
	});

	it("uses the local otherwise instead of the default extraction response", () => {
		const route = useRouteBuilder("GET", "/test")
			.extract({ query: { id: DDataStructure.string() } }, ({ response }) => response.badRequest(
				"invalid-query",
				{ source: "query" },
			))
			.handler((floor, { response }) => response.noContent("done"));
		type Responses = RouteDeclarationToContract<typeof route>["responses"];
		type _Information = DCommon.ExpectType<
			Responses["information"],
			"invalid-query" | "done",
			"strict"
		>;
		type _Body = DCommon.ExpectType<
			Extract<
				Responses,
				{ information: "invalid-query" }
			>["body"],
			{ readonly source: "query" },
			"strict"
		>;
		expect(route.definition.steps[0].definition.otherwise).toEqual(expect.any(Function));
	});

	it("represents SSE event shapes, encoded binary streams and text streams", () => {
		const route = useRouteBuilder("GET", "/test").handler((floor, { response, request }) => {
			if (request.path === "/events") {
				return response.serverSentEvents("events").onStart<string, { ping: { id: number } }>(() => { });
			}
			if (request.path === "/binary") {
				return response.stream("binary").onStart<{ id: number }>(() => { });
			}
			return response.streamText("text").onStart(() => { });
		});
		type Responses = RouteDeclarationToContract<typeof route>["responses"];
		type Expected =
			| {
				readonly code: "200";
				readonly information: "events";
				readonly events: { message: string } & { ping: { id: number } };
			}
			| {
				readonly code: "200";
				readonly information: "binary";
				readonly flux: Uint8Array<ArrayBuffer>;
			}
			| {
				readonly code: "200";
				readonly information: "text";
				readonly flux: string;
			};
		type _Responses = DCommon.ExpectType<
			Responses,
			Expected,
			"strict"
		>;
		expect(route.definition.steps).toHaveLength(1);
	});

	it("maps form-data files to browser File values", () => {
		const route = useRouteBuilder(
			"POST",
			"/upload",
			{
				bodyController: controlBodyAsFormData(
					{ maxFileQuantity: 1 },
				),
			},
		)
			.extract(
				{
					body: DDataStructure.object({
						file: DSDataStructure.file(),
						name: DDataStructure.string(),
					}),
				},
			)
			.handler(
				(floor, { response }) => response.noContent("uploaded"),
			);
		type Body = RouteDeclarationToContract<typeof route>["body"];
		type _Body = DCommon.ExpectType<
			Body,
			DCommon.TheFormData<{
				readonly file: File;
				readonly name: string;
			}>,
			"strict"
		>;
		expect(route.definition.bodyController.name).toBe("formData");
	});
});
