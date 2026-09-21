import * as DChrono from "@duplojs/lang/chrono";
import * as DEither from "@duplojs/lang/either";
// oxlint-disable-next-line duplojs-plugin/no-restricted-import
import { setEnvironment, TESTImplementation } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";
import { PredictedResponse, Request } from "@core";
import "@plugin-cacheController";
import { makeRouteFolder } from "@plugin-static";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";
import { createBodyReader } from "@test-utils/bodyReader";
import * as DPath from "@duplojs/lang/path";

describe("makeRouteFolder", async() => {
	setEnvironment("TEST");
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	const source = DSFile.createFolderInterface(DPath.declarePath("/tmp/folder"));

	const route = makeRouteFolder({
		prefix: "/folder",
		source,
	});
	const route2 = makeRouteFolder({
		prefix: "/folder",
		source,
		cacheControlConfig: {
			maxAge: 100,
			public: true,
		},
		directoryFallBackFile: DPath.declareSegment("index.txt"),
	});

	const buildedRoute = await useTestRouteFunctionBuilder(
		route,
		{
			globalHooksRouteLifeCycle: [{ afterSendResponse: spyResponse }],
		},
	);
	const buildedRoute2 = await useTestRouteFunctionBuilder(
		route2,
		{
			globalHooksRouteLifeCycle: [{ afterSendResponse: spyResponse }],
		},
	);

	it("source found", async() => {
		const modifiedAt = DChrono.createDate("2020-01-01");

		const defaultStat = {
			isFile: true,
			modifiedAt,
		} as DSFile.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(DEither.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"resource.found",
					expect.objectContaining({
						path: "/tmp/folder/file.txt",
					}),
				)
					.setHeader("last-modified", modifiedAt.toISOString()),
			}),
		);
	});

	it("source found but source modifiedAt does not exist", async() => {
		const defaultStat = {
			isFile: true,
			modifiedAt: null,
		} as DSFile.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(DEither.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"resource.found",
					expect.objectContaining({
						path: "/tmp/folder/file.txt",
					}),
				),
			}),
		);
	});

	it("source notModified", async() => {
		const modifiedAt = DChrono.createDate("2020-01-01");

		const defaultStat = {
			isFile: true,
			modifiedAt,
		} as DSFile.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(DEither.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {
					"if-modified-since": modifiedAt.toISOString(),
				},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("304", "resource.notModified", undefined)
					.setHeader("last-modified", modifiedAt.toISOString()),
			}),
		);
	});

	it("path not absolute", async() => {
		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/../folder2/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("invalid path", async() => {
		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/\0/folder2/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("resource requested notfound", async() => {
		const spyStat = vi.fn(() => Promise.resolve(DEither.left("file-system-stat")));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("resource requested is not a file", async() => {
		const defaultStat = {
			isFile: false,
		} as DSFile.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(DEither.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("index resource found", async() => {
		const modifiedAt = DChrono.createDate("2020-01-01");
		const spyStat = vi.fn()
			.mockResolvedValueOnce(
				DEither.success(
					{
						isDirectory: true,
						isFile: false,
					} as DSFile.StatInfo,
				),
			)
			.mockResolvedValueOnce(
				DEither.success(
					{
						isFile: true,
						modifiedAt,
					} as DSFile.StatInfo,
				),
			);
		TESTImplementation.set("stat", spyStat);

		await buildedRoute2(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/childrenFolder",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"resource.found",
					expect.objectContaining({
						path: "/tmp/folder/childrenFolder/index.txt",
					}),
				)
					.setHeaders({
						"last-modified": modifiedAt.toISOString(),
						"cache-control": "max-age=100,public",
					}),
			}),
		);
	});

	it("index resource is not exist", async() => {
		const spyStat = vi.fn()
			.mockResolvedValueOnce(
				DEither.success(
					{
						isFile: false,
					} as DSFile.StatInfo,
				),
			)
			.mockResolvedValueOnce(
				DEither.left("file-system-stat"),
			);
		TESTImplementation.set("stat", spyStat);

		await buildedRoute2(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/childrenFolder",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("resource is not a file", async() => {
		const spyStat = vi.fn()
			.mockResolvedValueOnce(
				DEither.success(
					{
						isFile: false,
						isDirectory: true,
					} as DSFile.StatInfo,
				),
			);
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/childrenFolder",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("index resource is not a file", async() => {
		const spyStat = vi.fn()
			.mockResolvedValueOnce(
				DEither.success(
					{
						isFile: false,
						isDirectory: true,
					} as DSFile.StatInfo,
				),
			)
			.mockResolvedValueOnce(
				DEither.success(
					{
						isFile: false,
						isDirectory: true,
					} as DSFile.StatInfo,
				),
			);
		TESTImplementation.set("stat", spyStat);

		await buildedRoute2(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/childrenFolder",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});
});
