import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import { NoSnapshotFoldersError, SnapshotPackageFolderNotFoundError, snapshotDist } from "../../bin/snapshotDist/snapshotDist";

describe("snapshotDist", () => {
	let workspace: (string & DPath.Path) | undefined = undefined;

	function path(relative: string) {
		DCommon.asserts(workspace, DCommon.isType("string"));
		return DPath.resolveRelative([workspace, DPath.createOrThrow(relative)]);
	}

	async function directory(relative: string) {
		await DCommon.asyncPipe(DSFile.ensureDirectory(path(relative)), DEither.unwrapRightOrThrow);
	}

	async function write(relative: string, content = "export type Value = string;") {
		const target = path(relative);
		const parent = DPath.getParentFolderPath(target);
		DCommon.asserts(parent, DCommon.isType("string"));
		await DCommon.asyncPipe(DSFile.ensureDirectory(parent), DEither.unwrapRightOrThrow);
		await DCommon.asyncPipe(DSFile.writeTextFile(target, content), DEither.unwrapRightOrThrow);
	}

	function read(relative: string) {
		return DCommon.asyncPipe(DSFile.readTextFile(path(relative)), DEither.unwrapRightOrThrow);
	}

	function run(inputPattern = ["**/dist/"], rootDir = "packages") {
		return snapshotDist({
			rootDir: DSFile.createFolderInterface(path(rootDir)),
			output: DSFile.createFolderInterface(path("libs/v1")),
			inputPattern,
		});
	}

	beforeEach(async() => {
		workspace = await DCommon.asyncPipe(
			DSFile.makeTemporaryDirectory("/tmp/duplojs-snapshot-dist-"),
			DEither.unwrapRightOrThrow,
			DPath.createOrThrow,
		);
		await directory("packages");
		await directory("libs/v1");
	});

	afterEach(async() => {
		if (workspace) {
			await DCommon.asyncPipe(DSFile.remove(workspace, { recursive: true }), DEither.unwrapRightOrThrow);
			workspace = undefined;
		}
	});

	it("copies only declarations, preserves their tree and overwrites existing declarations", async() => {
		await write("packages/lang/dist/index.d.ts", "export type Value = number;");
		await write("packages/lang/dist/common/index.d.ts");
		await write("packages/lang/dist/index.mjs");
		await write("packages/lang/dist/index.d.ts.map");
		await write("packages/lang/dist/index.d.mts");
		await write("packages/lang/dist/package.json");
		await write("packages/lang/src/ignored.d.ts");
		await write("packages/group/server/dist/index.d.ts");
		await write("packages/node_modules/ignored/dist/index.d.ts");
		await write("packages/lang/node_modules/ignored/dist/index.d.ts");
		await write("packages/lang/dist/node_modules/ignored/index.d.ts");
		await directory("packages/lang/dist/empty");
		await write("libs/v1/lang/dist/index.d.ts", "old");
		await write("libs/v1/lang/package.json", "manual package routing");
		await write("libs/v1/lang/node_modules/keep.txt", "keep");
		await directory("libs/v1/server");
		const linkSource = path("packages/lang/dist/index.d.ts");
		const linkTarget = path("packages/lang/dist/link.d.ts");
		await DCommon.asyncPipe(DSFile.symlink(linkSource, linkTarget), DEither.unwrapRightOrThrow);

		await run();

		const result = await DCommon.asyncPipe(
			DSFile.readDirectory(path("libs/v1/lang/dist"), { recursive: true }),
			DEither.unwrapRightOrThrow,
		);
		expect(result).toEqual(expect.arrayContaining(["index.d.ts", "common", "common/index.d.ts"]));
		expect(result).toHaveLength(3);
		expect(await read("libs/v1/lang/dist/index.d.ts")).toBe("export type Value = number;");
		expect(await read("libs/v1/server/dist/index.d.ts")).toBe("export type Value = string;");
		expect(await read("libs/v1/lang/package.json")).toBe("manual package routing");
		expect(await read("libs/v1/lang/node_modules/keep.txt")).toBe("keep");
	});

	it("supports several patterns and exclusions relative to rootDir", async() => {
		await write("packages/lang/dist/index.d.ts");
		await write("packages/server/dist/index.d.ts");
		await write("packages/tools/dist/index.d.ts");
		await directory("libs/v1/lang");
		await directory("libs/v1/server");

		await run(["lang/dist/", "server/dist/", "tools/dist/", "!tools/"]);

		expect(await read("libs/v1/lang/dist/index.d.ts")).toBe("export type Value = string;");
		expect(await read("libs/v1/server/dist/index.d.ts")).toBe("export type Value = string;");
	});

	it("checks each package before its copy and names the missing package", async() => {
		await write("packages/lang/dist/index.d.ts");
		await write("packages/server/dist/index.d.ts");
		await directory("libs/v1/lang");

		const result = run();
		await expect(result).rejects.toBeInstanceOf(SnapshotPackageFolderNotFoundError);
		await expect(result).rejects.toBeInstanceOf(Error);
		await expect(result).rejects.toThrow(`Snapshot package folder not found: ${path("libs/v1/server")}`);

		expect(await read("libs/v1/lang/dist/index.d.ts")).toBe("export type Value = string;");
	});

	it("rejects a destination package that is a file", async() => {
		await write("packages/lang/dist/index.d.ts");
		await write("libs/v1/lang", "not a folder");

		await expect(run()).rejects.toThrow(`Snapshot package folder not found: ${path("libs/v1/lang")}`);
	});

	it("rejects patterns that match no folder", async() => {
		await write("packages/lang/dist/index.d.ts");

		const result = run(["packages/**/dist/"]);
		await expect(result).rejects.toBeInstanceOf(NoSnapshotFoldersError);
		await expect(result).rejects.toBeInstanceOf(Error);
		await expect(result).rejects.toThrow("No folders matched inputPattern");
	});

	it("propagates source traversal errors", async() => {
		await expect(run(["**/dist/"], "missing")).rejects.toThrow();
	});

	it("propagates errors when the destination dist is a file", async() => {
		await write("packages/lang/dist/index.d.ts");
		await write("libs/v1/lang/dist", "not a folder");

		await expect(run()).rejects.toThrow();
		expect(await read("libs/v1/lang/dist")).toBe("not a folder");
	});

	it("propagates copy errors when a declaration target is a directory", async() => {
		await write("packages/lang/dist/index.d.ts");
		await directory("libs/v1/lang/dist/index.d.ts");

		await expect(run()).rejects.toThrow();
	});
});
