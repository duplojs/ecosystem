import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";

describe("from", () => {
	it("should create an array from an iterable", () => {
		const result = DArray.from(new Set(["a", "b"]));

		expect(result).toEqual(["a", "b"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[],
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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<readonly ("a" | "b")[]>,
			"strict"
		>;

		await expect(result).resolves.toEqual(["a", "b"]);
	});
});
