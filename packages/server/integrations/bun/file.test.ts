import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { DServerFile } from "@duplojs/server";
import { afterEach, beforeEach, describe, expect, it } from "bun:test";

const rootPath = DPath.createOrThrow(`${process.cwd()}/.tmp-file-bun`);

const paths = {
	workspace: DPath.createOrThrow(`${rootPath}/workspace`),
	text: DPath.createOrThrow(`${rootPath}/workspace/message.txt`),
	bytes: DPath.createOrThrow(`${rootPath}/workspace/bytes.bin`),
	json: DPath.createOrThrow(`${rootPath}/workspace/config.json`),
	copy: DPath.createOrThrow(`${rootPath}/copied.txt`),
	move: DPath.createOrThrow(`${rootPath}/moved.txt`),
};

describe("file feature on bun", () => {
	beforeEach(async() => {
		await DServerFile.remove(rootPath, { recursive: true });

		const result = await DServerFile.ensureDirectory(paths.workspace);

		expect(DEither.isRight(result)).toBe(true);
		expect(DEither.unwrapRight(result)).toBeUndefined();
	});

	afterEach(async() => {
		await DServerFile.remove(rootPath, { recursive: true });
	});

	it("writes, reads and stats a text file", async() => {
		const ensureFileResult = await DServerFile.ensureFile(paths.text);
		expect(DEither.isRight(ensureFileResult)).toBe(true);
		expect(DEither.unwrapRight(ensureFileResult)).toBeUndefined();

		const writeResult = await DServerFile.writeTextFile(paths.text, "hello bun");
		expect(DEither.isRight(writeResult)).toBe(true);
		expect(DEither.unwrapRight(writeResult)).toBeUndefined();

		const readResult = await DServerFile.readTextFile(paths.text);
		DCommon.asserts(readResult, DEither.isRight);
		expect(DEither.unwrapRight(readResult)).toBe("hello bun");

		const existsResult = await DServerFile.exists(paths.text);
		expect(DEither.isRight(existsResult)).toBe(true);
		expect(DEither.unwrapRight(existsResult)).toBeUndefined();

		const statResult = await DServerFile.stat(paths.text);
		DCommon.asserts(statResult, DEither.isRight);

		const stat = DEither.unwrapRight(statResult);
		expect(stat.isFile).toBe(true);
		expect(stat.sizeBytes).toBe("hello bun".length);
	});

	it("writes and reads binary content", async() => {
		const writeResult = await DServerFile.writeFile(paths.bytes, new Uint8Array([7, 8, 9]));
		expect(DEither.isRight(writeResult)).toBe(true);
		expect(DEither.unwrapRight(writeResult)).toBeUndefined();

		const readResult = await DServerFile.readFile(paths.bytes);
		DCommon.asserts(readResult, DEither.isRight);
		expect([...DEither.unwrapRight(readResult)]).toEqual([7, 8, 9]);
	});

	it("writes and reads JSON content", async() => {
		const writeResult = await DServerFile.writeJsonFile(
			paths.json,
			{
				runtime: "bun",
				ok: true,
			},
			{ space: 2 },
		);
		expect(DEither.isRight(writeResult)).toBe(true);
		expect(DEither.unwrapRight(writeResult)).toBeUndefined();

		const readResult = await DServerFile.readJsonFile(paths.json);
		DCommon.asserts(readResult, DEither.isRight);
		expect(DEither.unwrapRight(readResult)).toEqual({
			runtime: "bun",
			ok: true,
		});
	});

	it("copies, moves and truncates a file", async() => {
		const writeResult = await DServerFile.writeTextFile(paths.text, "hello bun");
		expect(DEither.isRight(writeResult)).toBe(true);
		expect(DEither.unwrapRight(writeResult)).toBeUndefined();

		const copyResult = await DServerFile.copy(paths.text, paths.copy);
		expect(DEither.isRight(copyResult)).toBe(true);
		expect(DEither.unwrapRight(copyResult)).toBeUndefined();

		const readCopyResult = await DServerFile.readTextFile(paths.copy);
		DCommon.asserts(readCopyResult, DEither.isRight);
		expect(DEither.unwrapRight(readCopyResult)).toBe("hello bun");

		const moveResult = await DServerFile.move(paths.copy, paths.move);
		expect(DEither.isRight(moveResult)).toBe(true);
		expect(DEither.unwrapRight(moveResult)).toBeUndefined();

		const readMoveResult = await DServerFile.readTextFile(paths.move);
		DCommon.asserts(readMoveResult, DEither.isRight);
		expect(DEither.unwrapRight(readMoveResult)).toBe("hello bun");

		const truncateResult = await DServerFile.truncate(paths.move, 5);
		expect(DEither.isRight(truncateResult)).toBe(true);
		expect(DEither.unwrapRight(truncateResult)).toBeUndefined();

		const readTruncateResult = await DServerFile.readTextFile(paths.move);
		DCommon.asserts(readTruncateResult, DEither.isRight);
		expect(DEither.unwrapRight(readTruncateResult)).toBe("hello");
	});
});
