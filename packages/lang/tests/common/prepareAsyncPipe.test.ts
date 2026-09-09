import { DCommon, type ExpectType } from "@scripts";

describe("prepareAsyncPipe", () => {
	it("creates an async pipe function for a fixed input type", async() => {
		const createPipe = DCommon.prepareAsyncPipe<string>();
		const result = createPipe(
			(input) => input.length,
			(input) => Promise.resolve(input + 1),
			(input) => `${input}`,
		)(Promise.resolve("value"));

		type _CheckResult = ExpectType<
			typeof result,
			Promise<`${number}`>,
			"strict"
		>;

		await expect(result).resolves.toBe("6");
	});
});
