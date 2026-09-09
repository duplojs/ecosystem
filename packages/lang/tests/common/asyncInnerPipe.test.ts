import { DCommon, type ExpectType } from "@scripts";

describe("asyncInnerPipe", () => {
	it("creates an async pipe function", async() => {
		const innerPipe = DCommon.asyncInnerPipe(
			(input: string) => input.length,
			(input) => Promise.resolve(input + 1),
			(input) => `${input}`,
		);
		const result = innerPipe(Promise.resolve("value"));

		type _CheckResult = ExpectType<
			typeof result,
			Promise<`${number}`>,
			"strict"
		>;

		await expect(result).resolves.toBe("6");
	});
});
