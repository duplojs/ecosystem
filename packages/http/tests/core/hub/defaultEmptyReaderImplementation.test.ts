import { EmptyBodyController, Request, defaultEmptyReaderImplementation } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

describe("defaultEmptyReaderImplementation", () => {
	it("read empty body and return undefined", async() => {
		const bodyController = EmptyBodyController.create({});
		const bodyReader = bodyController.createReaderOrThrow(
			defaultEmptyReaderImplementation,
		);
		const request = new Request({
			headers: {},
			host: "",
			matchedPath: null,
			method: "GET",
			origin: "",
			params: {},
			path: "/",
			query: {},
			url: "/",
			bodyReader,
		});

		const undefinedParseFunction = DDataStructure.undefined().asyncParse;
		await expect(
			request
				.getBodyResult()
				.extract(DCommon.forward, undefinedParseFunction),
		).resolves.toStrictEqual(DEither.right("parse-success", undefined));
	});
});
