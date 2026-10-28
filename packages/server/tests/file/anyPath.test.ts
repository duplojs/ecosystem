import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { DSFile, TESTImplementation, setEnvironment } from "@scripts";

describe("file path inputs", () => {
	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		{ path: DCommon.infer("folder/entry") as string & DPath.Path },
		{ path: DCommon.infer("/entry") as string & DPath.Absolute },
		{ path: DCommon.infer("entry") as string & DPath.Segment },
	])("accepts $path in direct and curried calls", async({ path }) => {
		setEnvironment("TEST");
		const exists = vi.fn(() => Promise.resolve(DEither.right("file-system-exists")));
		const copy = vi.fn(() => Promise.resolve(DEither.right("file-system-copy")));
		const writeTextFile = vi.fn(() => Promise.resolve(DEither.right("file-system-write-text-file")));
		TESTImplementation.set("exists", exists);
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("writeTextFile", writeTextFile);

		const existsResult = await DSFile.exists(path);
		const copyResult = await DSFile.copy(path, path);
		const curriedCopyResult = await DCommon.pipe(path, DSFile.copy(path));
		const writeResult = await DSFile.writeTextFile(path, "content");
		const curriedWriteResult = await DCommon.pipe(path, DSFile.writeTextFile("content"));

		DEither.unwrapByInformationOrThrow(existsResult, "file-system-exists");
		DEither.unwrapByInformationOrThrow(copyResult, "file-system-copy");
		DEither.unwrapByInformationOrThrow(curriedCopyResult, "file-system-copy");
		DEither.unwrapByInformationOrThrow(writeResult, "file-system-write-text-file");
		DEither.unwrapByInformationOrThrow(curriedWriteResult, "file-system-write-text-file");
		expect(exists).toHaveBeenCalledWith(path);
		expect(copy).toHaveBeenCalledTimes(2);
		expect(copy).toHaveBeenCalledWith(path, path);
		expect(writeTextFile).toHaveBeenCalledTimes(2);
		expect(writeTextFile).toHaveBeenCalledWith(path, "content");
	});
});
