import { createHub, launchHookServer, ResponseContract, useRouteBuilder } from "@core";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
// oxlint-disable-next-line duplojs-plugin/no-restricted-import
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import { codeGeneratorPlugin } from "@plugin-codeGenerator";

describe("plugin implementation", () => {
	setEnvironment("TEST");
	const spy = vi.fn((path: string, content: string) => Promise.resolve(DEither.ok()));
	const spyExists = vi.fn<DCommon.AnyFunction>((path: string) => Promise.resolve(DEither.left("file-system-exists")));
	const spyMakeDirectory = vi.fn((path: string) => Promise.resolve(DEither.ok()));
	const spyRemove = vi.fn((path: string, params?: { recursive?: boolean }) => Promise.resolve(DEither.ok()));
	TESTImplementation.set("writeTextFile", spy);
	TESTImplementation.set("exists", spyExists);
	TESTImplementation.set("makeDirectory", spyMakeDirectory);
	TESTImplementation.set("remove", spyRemove);

	beforeEach(() => {
		spy.mockClear();
		spyExists.mockClear();
		spyMakeDirectory.mockClear();
		spyRemove.mockClear();
	});

	const route = useRouteBuilder("GET", "/user")
		.extract({
			headers: {
				header1: DDataStructure.date(),
				header2: DDataStructure.time(),
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

	it("generate API type", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({ outputFile: DCommon.cast("test.d.ts") }))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy.mock.lastCall?.at(0)).toBe("test.d.ts");
		expect(spy.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("not generate API type", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({ outputFile: DCommon.cast("test.d.ts") }));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("not generate in PROD env", async() => {
		const hub = createHub({ environment: "PROD" })
			.plug(codeGeneratorPlugin({ outputFile: DCommon.cast("test.d.ts") }))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("generate data parser files from identified route data parsers", async() => {
		const childStructure = DDataStructure.string().setIdentifier("ChildParser");
		const bodyStructure = DDataStructure.object({
			child: childStructure,
			count: DDataStructure.number(),
		}).setIdentifier("BodyParser");

		const route = useRouteBuilder("GET", "/generated")
			.extract({
				body: bodyStructure,
			})
			.handler(
				ResponseContract.ok("generated.success", childStructure),
				(__, { response }) => response("generated.success", ""),
			);

		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({
				outputFile: DCommon.cast("routes.d.ts"),
				generateStructure: {
					outputFolder: DCommon.cast("generated"),
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy.mock.calls).toHaveLength(5);
		expect(spy.mock.calls[0]).toMatchSnapshot();
		expect(spy.mock.calls[1]).toMatchSnapshot();
		expect(spy.mock.calls[2]).toMatchSnapshot();
		expect(spy.mock.calls[3]).toMatchSnapshot();
		expect(spy.mock.calls[4]).toMatchSnapshot();
	});

	it("generate data parser files only from explicit data parsers when disabledFromRoute is enabled", async() => {
		const routeStructure = DDataStructure.string().setIdentifier("RouteParser");
		const explicitStructure = DDataStructure.number().setIdentifier("ExplicitParser");

		const route = useRouteBuilder("GET", "/generated")
			.extract({
				body: routeStructure,
			})
			.handler(
				ResponseContract.noContent("generated.success"),
				(__, { response }) => response("generated.success"),
			);

		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({
				outputFile: DCommon.cast("routes.d.ts"),
				generateStructure: {
					outputFolder: DCommon.cast("generated"),
					disabledFromRoute: true,
					structures: [explicitStructure],
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy.mock.calls).toHaveLength(4);
		expect(spy.mock.calls[0]).toMatchSnapshot();
		expect(spy.mock.calls[1]).toMatchSnapshot();
		expect(spy.mock.calls[2]).toMatchSnapshot();
		expect(spy.mock.calls[3]).toMatchSnapshot();
	});

	it("remove existing generated folder before recreating it", async() => {
		spyExists.mockImplementationOnce((path: string) => Promise.resolve(DEither.ok()));

		const explicitStructure = DDataStructure.number().setIdentifier("ExplicitParser");

		const route = useRouteBuilder("GET", "/generated")
			.handler(
				ResponseContract.noContent("generated.success"),
				(__, { response }) => response("generated.success"),
			);

		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({
				outputFile: DCommon.cast("routes.d.ts"),
				generateStructure: {
					outputFolder: DCommon.cast("generated"),
					disabledFromRoute: true,
					structures: [explicitStructure],
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spyExists).toHaveBeenCalledWith("generated");
		expect(spyRemove).toHaveBeenCalledWith("generated", { recursive: true });
		expect(spyMakeDirectory).toHaveBeenCalledWith("generated");
	});
});
