import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("whenIsLeftOtherwise", () => {
	it("should call the left callback for left values", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(21)
		);

		const result = DEither.whenIsLeftOtherwise(
			input,
			(value) => {
				expect(value).toBe("message");
				return "MESSAGE";
			},
			(value) => {
				type _CheckValue = DCommon.ExpectType<
					typeof value,
					DEither.Success<21>,
					"strict"
				>;

				return value;
			},
		);

		expect(result).toBe("MESSAGE");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"MESSAGE" | DEither.Success<21>,
			"strict"
		>;
	});

	it("should call the otherwise callback for non left values in pipe", () => {
		const input = DEither.success(42);
		const result = DCommon.pipe(
			input,
			DEither.whenIsLeftOtherwise(
				(value) => value,
				(value) => DEither.unwrapRight(value),
			),
		);

		expect(result).toBe(42);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			42,
			"strict"
		>;
	});
});
