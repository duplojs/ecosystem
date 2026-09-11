import { rm } from "node:fs/promises";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { DServerFile } from "@duplojs/server";

const rootPath = `${process.cwd()}/.tmp-file-node`;
const fixturesPath = `${process.cwd()}/fixtures/file` as never;

const paths = {
	workspace: `${rootPath}/workspace`,
	text: `${rootPath}/workspace/message.txt`,
	bytes: `${rootPath}/workspace/bytes.bin`,
	json: `${rootPath}/workspace/config.json`,
	copy: `${rootPath}/copy`,
	move: `${rootPath}/moved.txt`,
};

void describe("file feature on node", () => {
	beforeEach(async() => {
		await rm(rootPath, {
			force: true,
			recursive: true,
		});

		const result = await DServerFile.ensureDirectory(paths.workspace as never);

		assert.equal(DEither.isRight(result), true);
		assert.equal(DEither.unwrapRight(result), undefined);
	});

	afterEach(async() => {
		await rm(rootPath, {
			force: true,
			recursive: true,
		});
	});

	void it("writes, appends, reads and stats a text file", async() => {
		const writeResult = await DServerFile.writeTextFile(paths.text as never, "hello");
		assert.equal(DEither.isRight(writeResult), true);
		assert.equal(DEither.unwrapRight(writeResult), undefined);

		const appendResult = await DServerFile.appendTextFile(paths.text as never, " node");
		assert.equal(DEither.isRight(appendResult), true);
		assert.equal(DEither.unwrapRight(appendResult), undefined);

		const readResult = await DServerFile.readTextFile(paths.text as never);
		DCommon.asserts(readResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readResult), "hello node");

		const existsResult = await DServerFile.exists(paths.text as never);
		assert.equal(DEither.isRight(existsResult), true);
		assert.equal(DEither.unwrapRight(existsResult), undefined);

		const statResult = await DServerFile.stat(paths.text as never);
		DCommon.asserts(statResult, DEither.isRight);

		const stat = DEither.unwrapRight(statResult);
		assert.equal(stat.isFile, true);
		assert.equal(stat.sizeBytes, "hello node".length);
	});

	void it("writes, appends and reads binary content", async() => {
		const writeResult = await DServerFile.writeFile(paths.bytes as never, new Uint8Array([1, 2]));
		assert.equal(DEither.isRight(writeResult), true);
		assert.equal(DEither.unwrapRight(writeResult), undefined);

		const appendResult = await DServerFile.appendFile(paths.bytes as never, new Uint8Array([3]));
		assert.equal(DEither.isRight(appendResult), true);
		assert.equal(DEither.unwrapRight(appendResult), undefined);

		const readResult = await DServerFile.readFile(paths.bytes as never);
		DCommon.asserts(readResult, DEither.isRight);
		assert.deepEqual([...DEither.unwrapRight(readResult)], [1, 2, 3]);
	});

	void it("writes and reads JSON content", async() => {
		const writeResult = await DServerFile.writeJsonFile(
			paths.json as never,
			{
				runtime: "node",
				ok: true,
			},
			{ space: 2 },
		);
		assert.equal(DEither.isRight(writeResult), true);
		assert.equal(DEither.unwrapRight(writeResult), undefined);

		const readResult = await DServerFile.readJsonFile(paths.json as never);
		DCommon.asserts(readResult, DEither.isRight);
		assert.deepEqual(DEither.unwrapRight(readResult), {
			runtime: "node",
			ok: true,
		});
	});

	void it("copies, moves, renames and truncates a file", async() => {
		const copyResult = await DServerFile.copy(fixturesPath, paths.copy as never);
		assert.equal(DEither.isRight(copyResult), true);
		assert.equal(DEither.unwrapRight(copyResult), undefined);

		const readCopyResult = await DServerFile.readTextFile(`${paths.copy}/source.txt` as never);
		DCommon.asserts(readCopyResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readCopyResult), "Hello from fixture.\n");

		const moveResult = await DServerFile.move(`${paths.copy}/source.txt` as never, paths.move as never);
		assert.equal(DEither.isRight(moveResult), true);
		assert.equal(DEither.unwrapRight(moveResult), undefined);

		const renamedResult = await DServerFile.rename(paths.move as never, DCommon.infer("renamed.txt"));
		DCommon.asserts(renamedResult, DEither.isRight);

		const renamedPath = DEither.unwrapRight(renamedResult);
		const readRenamedResult = await DServerFile.readTextFile(renamedPath);
		DCommon.asserts(readRenamedResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readRenamedResult), "Hello from fixture.\n");

		const truncateResult = await DServerFile.truncate(renamedPath, 5);
		assert.equal(DEither.isRight(truncateResult), true);
		assert.equal(DEither.unwrapRight(truncateResult), undefined);

		const readTruncateResult = await DServerFile.readTextFile(renamedPath);
		DCommon.asserts(readTruncateResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(readTruncateResult), "Hello");
	});
});
