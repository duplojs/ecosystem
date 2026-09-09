import { DCommon, type ExpectType } from "@scripts";

describe("loop", () => {
	it("loops until exit and forwards the previous output", () => {
		const visited: unknown[] = [];
		const result = DCommon.loop<string, number>((params) => {
			visited.push(params.previousOutput);

			if (params.count === 3) {
				return params.exit(`done-${params.previousOutput}`);
			}

			return params.next((params.previousOutput ?? 0) + 1);
		});

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("done-3");
		expect(visited).toStrictEqual([undefined, 1, 2, 3]);
	});
});
