
import * as DCommon from "@scripts/common";

describe("loop", () => {
	it("loops until exit", () => {
		const visited: number[] = [];
		const result = DCommon.loop<string, number>((params) => {
			visited.push(params.count);

			if (params.count === 3) {
				return params.exit(`done-${params.count}`);
			}

			return params.next(params.count + 1);
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("done-3");
		expect(visited).toStrictEqual([0, 1, 2, 3]);
	});
});
