import { DArray, type ExpectType } from "@scripts";

describe("from", () => {
	it("should create an array from an iterable", () => {
		const result = DArray.from(new Set(["a", "b"]));

		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[],
			"strict"
		>;
	});

	it("should create an array from an array-like value", () => {
		const result = DArray.from({
			0: "a",
			1: "b",
			length: 2,
		});

		expect(result).toEqual(["a", "b"]);
	});

	it("should create an array from an async iterable", async() => {
		async function *createAsyncIterable() {
			await Promise.resolve();
			yield "a";
			yield "b";
		}

		const result = DArray.from(createAsyncIterable());

		type _CheckResult = ExpectType<
			typeof result,
			Promise<("a" | "b")[]>,
			"strict"
		>;

		await expect(result).resolves.toEqual(["a", "b"]);
	});
});
