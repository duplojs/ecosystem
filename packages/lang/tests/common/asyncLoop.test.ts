
import * as DCommon from "@scripts/common";

describe("asyncLoop", () => {
	it("awaits every loop step until exit", async() => {
		const visited: number[] = [];
		const result = DCommon.asyncLoop<string, number>((params) => {
			visited.push(params.count);

			if (params.count === 2) {
				return Promise.resolve(params.exit(`done-${params.count}`));
			}

			return Promise.resolve(params.next(params.count + 1));
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<string>,
			"strict"
		>;

		await expect(result).resolves.toBe("done-2");
		expect(visited).toStrictEqual([0, 1, 2]);
	});
});
