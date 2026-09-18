// oxlint-disable-next-line duplojs-plugin/no-restricted-import
import { setEnvironment, TESTImplementation } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";
import { createHub, launchHookServer } from "@core";
import { staticPlugin } from "@plugin-static";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";

describe("static plugin implementation", () => {
	setEnvironment("TEST");

	const sourceFile = DSFile.createFileInterface(DPath.declarePath("/tmp/file.txt"));
	const sourceFolder = DSFile.createFolderInterface(DPath.declarePath("/tmp/folder"));

	const hubFile = createHub({ environment: "DEV" })
		.plug(staticPlugin(sourceFile, { path: "/file" }));

	const hubFolder = createHub({ environment: "DEV" })
		.plug(staticPlugin(sourceFolder, { prefix: "/folder" }));

	it("API file source not exist", async() => {
		const spyStat = vi.fn(() => Promise.resolve(DEither.left("file-system-stat")));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFile.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFile,
				{} as any,
			),
		).rejects.toThrow();
	});

	it("API file source is not file", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			DEither.success(
				{
					isFile: false,
				} as DSFile.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFile.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFile,
				{} as any,
			),
		).rejects.toThrow();
	});

	it("API file expect good", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			DEither.success(
				{
					isFile: true,
				} as DSFile.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFile.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFile,
				{} as any,
			),
		).resolves.toBeUndefined();
	});

	it("API folder source is not folder", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			DEither.success(
				{
					isFile: true,
				} as DSFile.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFolder.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFolder,
				{} as any,
			),
		).rejects.toThrow();
	});

	it("API folder expect good", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			DEither.success(
				{
					isFile: false,
				} as DSFile.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFolder.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFolder,
				{} as any,
			),
		).resolves.toBeUndefined();
	});
});
