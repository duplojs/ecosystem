import { createHub, launchHookServer, ResponseContract, useRouteBuilder } from "@core";
// oxlint-disable-next-line duplojs-plugin/no-restricted-import
import { setEnvironment, TESTImplementation } from "@duplojs/server";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { openApiGeneratorPlugin } from "@plugin-openApiGenerator";
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

describe("plugin implementation", () => {
	setEnvironment("TEST");
	const spyWriteTextFile = vi.fn((path: string, content: string) => Promise.resolve(DEither.right("file-system-write-text-file")));
	TESTImplementation.set("writeTextFile", spyWriteTextFile);

	beforeEach(() => {
		spyWriteTextFile.mockClear();
	});

	const route = useRouteBuilder("GET", "/user")
		.extract({
			headers: {
				header1: DDataStructure.string(),
				header2: DDataStructure.string(),
			},
			body: DDataStructure.object({
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			}),
		})
		.cut(
			ResponseContract.conflict("the-conflict"),
			(__, { response }) => response("the-conflict"),
		)
		.handler(
			ResponseContract.ok("success", DDataStructure.string()),
			(__, { response }) => response("success", ""),
		);

	it("generate OpenApi file", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(openApiGeneratorPlugin({
				outputFile: DCommon.cast("swagger.json"),
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as any,
		);

		expect(spyWriteTextFile.mock.lastCall?.at(0)).toBe("swagger.json");
		expect(spyWriteTextFile.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("generate OpenApi file with type bearer ok security option", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				openApiGeneratorPlugin({
					outputFile: DCommon.cast("swagger.json"),
					routePath: "/swagger",
					security: { type: "bearer" },
				}),
			)
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as any,
		);

		expect(spyWriteTextFile.mock.lastCall?.at(0)).toBe("swagger.json");
		expect(spyWriteTextFile.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("generate OpenApi file with type apiKey ok security option", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(openApiGeneratorPlugin({
				outputFile: DCommon.cast("swagger.json"),
				routePath: "/swagger",
				security: {
					type: "apiKey",
					in: "cookie",
					paramName: "token",
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as any,
		);

		expect(spyWriteTextFile.mock.lastCall?.at(0)).toBe("swagger.json");
		expect(spyWriteTextFile.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("not generate OpenApi file", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(openApiGeneratorPlugin({
				routePath: "/swagger",
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as any,
		);

		expect(spyWriteTextFile).not.toHaveBeenCalled();
	});

	it("empty route", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(openApiGeneratorPlugin({
				outputFile: DCommon.cast("swagger.json"),
			}));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as any,
		);

		expect(spyWriteTextFile).not.toHaveBeenCalled();
	});

	it("empty params", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(openApiGeneratorPlugin({}));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as any,
		);

		expect(spyWriteTextFile).not.toHaveBeenCalled();
	});

	it("not generate in PROD env", async() => {
		const hub = createHub({ environment: "PROD" })
			.plug(openApiGeneratorPlugin({ outputFile: DCommon.cast("swagger.json") }));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as any,
		);

		expect(spyWriteTextFile).not.toHaveBeenCalled();
	});
});
