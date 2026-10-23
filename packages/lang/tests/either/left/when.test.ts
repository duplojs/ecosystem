import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("whenIsLeft", () => {
	it("should map left values and keep right or plain inputs unchanged", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(21)
		);

		const result = DEither.whenIsLeft(
			input,
			(value) => {
				expect(value).toBe("message");
				return "MESSAGE";
			},
		);

		expect(result).toBe("MESSAGE");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"MESSAGE" | DEither.Success<21>,
			"strict"
		>;
	});

	it("should map left values in pipe", () => {
		const result = DCommon.pipe(
			DEither.left("value", "data"),
			DEither.whenIsLeft((value) => {
				expect(value).toBe("data");
				return "DATA";
			}),
		);

		expect(result).toBe("DATA");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"DATA",
			"strict"
		>;
	});

	it("should keep non left input in pipe", () => {
		const input = DEither.success(42);
		const result = DCommon.pipe(
			input,
			DEither.whenIsLeft((value) => value),
		);

		expect(result).toBe(input);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;
	});
});
