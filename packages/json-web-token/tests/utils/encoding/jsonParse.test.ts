import * as DEither from "@duplojs/lang/either";
import { jsonParse } from "@scripts";

describe("jsonParse", () => {
	it("parses valid json", () => {
		const result = jsonParse("{\"name\":\"duplo\",\"ok\":true,\"list\":[1,2,3]}");

		expect(DEither.isLeft(result)).toBe(false);

		expect(result).toEqual({
			name: "duplo",
			ok: true,
			list: [1, 2, 3],
		});
	});

	it("returns left on invalid json", () => {
		expect(jsonParse("{")).toBeUndefined();
	});
});
