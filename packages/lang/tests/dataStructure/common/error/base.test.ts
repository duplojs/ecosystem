import { DDataStructure } from "@scripts";

describe("createErrorHandler", () => {
	it("collects structure issues with their source, sub source, data and path", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const pathStage = errorHandler.createPathStage();
		const structure = DDataStructure.string();

		pathStage.setCurrentPath("name");
		errorHandler.addIssue(structure, 123, structure.definition.type);

		expect(errorHandler.issues).toHaveLength(1);
		expect(errorHandler.issues[0]).toMatchObject({
			data: 123,
			path: "name",
		});
		expect(errorHandler.issues[0]?.getSource()).toBe(structure);
		expect(DDataStructure.issueKind.has(errorHandler.issues[0])).toBe(true);
		expect(
			(errorHandler.issues[0] as DDataStructure.Issue | undefined)
				?.getSubSource?.(),
		).toBe(structure.definition.type);
	});

	it("collects encode and decode issues with their codec source and message", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			(data): data is number => typeof data === "number",
			(data) => data.length,
			(data) => `value-${data}`,
		);

		errorHandler.addEncodeIssue(codec, "external", "encode-data", "Encode message");
		errorHandler.addDecodeIssue(codec, "external", "decode-data", "Decode message");

		expect(errorHandler.issues[0]).toMatchObject({
			data: "encode-data",
			from: "external",
			message: "Encode message",
			path: "",
		});
		expect(errorHandler.issues[0]?.getSource()).toBe(codec);
		expect(DDataStructure.encodeIssueKind.has(errorHandler.issues[0])).toBe(true);
		expect(errorHandler.issues[1]).toMatchObject({
			data: "decode-data",
			from: "external",
			message: "Decode message",
			path: "",
		});
		expect(errorHandler.issues[1]?.getSource()).toBe(codec);
		expect(DDataStructure.decodeIssueKind.has(errorHandler.issues[1])).toBe(true);
	});

	it("handles nested path stages and closes them in order", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const stringStructure = DDataStructure.string();
		const numberStructure = DDataStructure.number();
		const bigintStructure = DDataStructure.bigint();
		const firstPathStage = errorHandler.createPathStage();

		firstPathStage.setCurrentPath("user");
		const secondPathStage = errorHandler.createPathStage();
		secondPathStage.setCurrentPath("name");
		errorHandler.addIssue(stringStructure, 123);

		secondPathStage.close();
		errorHandler.addIssue(numberStructure, "not-a-number");

		firstPathStage.close();
		errorHandler.addIssue(bigintStructure, "not-a-bigint");

		expect(errorHandler.issues.map((issue) => issue.path)).toStrictEqual([
			"user.name",
			"user",
			"",
		]);
	});

	it("ignores closing a path stage when no stage is open", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const structure = DDataStructure.string();
		const pathStage = errorHandler.createPathStage();

		pathStage.close();
		pathStage.close();
		errorHandler.addIssue(structure, "value");

		expect(errorHandler.currentPath).toStrictEqual([]);
		expect(errorHandler.issues[0]?.path).toBe("");
	});

	it("creates an error from the collected issues", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const structure = DDataStructure.string();

		errorHandler.addIssue(structure, 123);

		expect(errorHandler.createError()).toStrictEqual({
			issues: errorHandler.issues,
		});
	});

	it("imports issues from error handlers and lazy error handlers", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const firstImportedErrorHandler = DDataStructure.createErrorHandler();
		const getSecondImportedErrorHandler = DDataStructure.createGetErrorHandler();
		const stringStructure = DDataStructure.string();
		const numberStructure = DDataStructure.number();

		firstImportedErrorHandler.addIssue(stringStructure, 123);
		getSecondImportedErrorHandler().addIssue(numberStructure, "not-a-number");

		errorHandler.importIssues([
			firstImportedErrorHandler,
			getSecondImportedErrorHandler,
		]);

		expect(errorHandler.issues).toHaveLength(2);
		expect(errorHandler.issues[0]?.getSource()).toBe(stringStructure);
		expect(errorHandler.issues[1]?.getSource()).toBe(numberStructure);
		expect(errorHandler.issues.map((issue) => issue.data)).toStrictEqual([
			123,
			"not-a-number",
		]);
	});

	it("uses an initial path before collecting new issues", () => {
		const errorHandler = DDataStructure.createErrorHandler(["user", "name"]);
		const stringStructure = DDataStructure.string();
		const numberStructure = DDataStructure.number();
		const path = ["user", "name"];

		path.push("ignored");
		errorHandler.addIssue(stringStructure, 123);

		const pathStage = errorHandler.createPathStage();
		pathStage.setCurrentPath("firstName");
		errorHandler.addIssue(numberStructure, "not-a-number");

		expect(errorHandler.issues.map((issue) => issue.path)).toStrictEqual([
			"user.name",
			"user.name.firstName",
		]);
	});
});

describe("createGetErrorHandler", () => {
	it("lazily creates and reuses the same error handler", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const firstErrorHandler = getErrorHandler();
		const secondErrorHandler = getErrorHandler();
		const structure = DDataStructure.string();

		firstErrorHandler.addIssue(structure, 123);

		expect(secondErrorHandler).toBe(firstErrorHandler);
		expect(secondErrorHandler.issues).toHaveLength(1);
	});
});
