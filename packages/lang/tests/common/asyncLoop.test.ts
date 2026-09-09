import { DCommon, type ExpectType } from "@scripts";

describe("asyncLoop", () => {
	it("awaits every loop step until exit", async() => {
		const visited: unknown[] = [];
		const result = DCommon.asyncLoop<string, number>((params) => {
			visited.push(params.previousOutput);

			if (params.count === 2) {
				return Promise.resolve(params.exit(`done-${params.previousOutput}`));
			}

			return Promise.resolve(params.next((params.previousOutput ?? 0) + 1));
		});

		type _CheckResult = ExpectType<
			typeof result,
			Promise<string>,
			"strict"
		>;

		await expect(result).resolves.toBe("done-2");
		expect(visited).toStrictEqual([undefined, 1, 2]);
	});
});
