import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DServerFile } from "@duplojs/server";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

const rootPath = `${Deno.cwd()}/.tmp-file-deno`;

const paths = {
	workspace: `${rootPath}/workspace` as never,
	text: `${rootPath}/workspace/message.txt` as never,
	bytes: `${rootPath}/workspace/bytes.bin` as never,
	json: `${rootPath}/workspace/config.json` as never,
	hardLink: `${rootPath}/workspace/hard-link.txt` as never,
	relocatedParent: `${rootPath}/relocated` as never,
};

void describe("file feature on deno", () => {
	beforeEach(async() => {
		await Deno.remove(rootPath, { recursive: true }).catch(() => undefined);

		const result = await DServerFile.ensureDirectory(paths.workspace);

		DCommon.asserts(result, DEither.isRight);
		assert.equal(DEither.unwrapRight(result), undefined);
	});

	afterEach(async() => {
		await Deno.remove(rootPath, { recursive: true }).catch(() => undefined);
	});

	void it("writes, appends, reads and stats a text file", async() => {
		const ensureFileResult = await DServerFile.ensureFile(paths.text);
		DCommon.asserts(ensureFileResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(ensureFileResult), undefined);

		const writeResult = await DServerFile.writeTextFile(paths.text, "hello");
		DCommon.asserts(writeResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(writeResult), undefined);

		const appendResult = await DServerFile.appendTextFile(paths.text, " deno");
		DCommon.asserts(appendResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(appendResult), undefined);

		const readResult = await DServerFile.readTextFile(paths.text);
		DCommon.asserts(readResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readResult), "hello deno");

		const existsResult = await DServerFile.exists(paths.text);
		DCommon.asserts(existsResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(existsResult), undefined);

		const statResult = await DServerFile.stat(paths.text);
		DCommon.asserts(statResult, DEither.isRight);

		const stat = DEither.unwrapRight(statResult);
		assert.equal(stat.isFile, true);
		assert.equal(stat.sizeBytes, "hello deno".length);
	});

	void it("writes, appends and reads binary content", async() => {
		const writeResult = await DServerFile.writeFile(paths.bytes, new Uint8Array([4, 5]));
		DCommon.asserts(writeResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(writeResult), undefined);

		const appendResult = await DServerFile.appendFile(paths.bytes, new Uint8Array([6]));
		DCommon.asserts(appendResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(appendResult), undefined);

		const readResult = await DServerFile.readFile(paths.bytes);
		DCommon.asserts(readResult, DEither.isRight);
		assert.deepEqual([...DEither.unwrapRight(readResult)], [4, 5, 6]);
	});

	void it("writes and reads JSON content", async() => {
		const writeResult = await DServerFile.writeJsonFile(
			paths.json,
			{
				runtime: "deno",
				ok: true,
			},
			{ space: 2 },
		);
		DCommon.asserts(writeResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(writeResult), undefined);

		const readResult = await DServerFile.readJsonFile(paths.json);
		DCommon.asserts(readResult, DEither.isRight);
		assert.deepEqual(DEither.unwrapRight(readResult), {
			runtime: "deno",
			ok: true,
		});
	});

	void it("links, renames, relocates and truncates a file", async() => {
		const writeResult = await DServerFile.writeTextFile(paths.text, "hello deno");
		DCommon.asserts(writeResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(writeResult), undefined);

		const linkResult = await DServerFile.link(paths.text, paths.hardLink);
		DCommon.asserts(linkResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(linkResult), undefined);

		const readLinkContentResult = await DServerFile.readTextFile(paths.hardLink);
		DCommon.asserts(readLinkContentResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readLinkContentResult), "hello deno");

		const renamedResult = await DServerFile.rename(paths.hardLink, "renamed.txt" as never);
		DCommon.asserts(renamedResult, DEither.isRight);

		const renamedPath = DEither.unwrapRight(renamedResult);
		const readRenamedResult = await DServerFile.readTextFile(renamedPath);
		DCommon.asserts(readRenamedResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readRenamedResult), "hello deno");

		const ensureRelocatedParentResult = await DServerFile.ensureDirectory(paths.relocatedParent);
		DCommon.asserts(ensureRelocatedParentResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(ensureRelocatedParentResult), undefined);

		const relocatedResult = await DServerFile.relocate(renamedPath, paths.relocatedParent);
		DCommon.asserts(relocatedResult, DEither.isRight);

		const relocatedPath = DEither.unwrapRight(relocatedResult);
		const readRelocatedResult = await DServerFile.readTextFile(relocatedPath);
		DCommon.asserts(readRelocatedResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readRelocatedResult), "hello deno");

		const truncateResult = await DServerFile.truncate(relocatedPath, 5);
		DCommon.asserts(truncateResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(truncateResult), undefined);

		const readTruncateResult = await DServerFile.readTextFile(relocatedPath);
		DCommon.asserts(readTruncateResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readTruncateResult), "hello");
	});
});
