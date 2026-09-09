import { DModeling, DPattern, pipe, type ExpectType } from "@scripts";

describe("matchWithTaggedObjectOtherwise", () => {
	interface Success extends DModeling.ObjectTag<"success"> {
		value: number;
	}

	interface Failure extends DModeling.ObjectTag<"failure"> {
		error: string;
	}

	type Input = Success | Failure;

	it("should match a handled tagged object and narrow both callbacks", () => {
		const input = DModeling.taggedObject("success", {
			value: 42,
		}) as Input;

		const result = DPattern.matchWithTaggedObjectOtherwise(input, {
			success: (value) => {
				type check = ExpectType<
					typeof value,
					Success,
					"strict"
				>;

				return value.value;
			},
		}, (value) => {
			type check = ExpectType<
				typeof value,
				Failure,
				"strict"
			>;

			return value.error;
		});

		expect(result).toBe(42);

		type check = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should delegate an unhandled tagged object in pipe", () => {
		const input = DModeling.taggedObject("failure", {
			error: "failed",
		}) as Input;

		const result = pipe(
			input,
			DPattern.matchWithTaggedObjectOtherwise({
				success: (value) => {
					type check = ExpectType<
						typeof value,
						Success,
						"strict"
					>;

					return value.value;
				},
			}, (value) => {
				type check = ExpectType<
					typeof value,
					Failure,
					"strict"
				>;

				return value.error;
			}),
		);

		expect(result).toBe("failed");

		type check = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should reject matcher keys outside the input tags", () => {
		const input = DModeling.taggedObject("success", {
			value: 42,
		}) as Input;

		DPattern.matchWithTaggedObjectOtherwise(
			input,
			// @ts-expect-error matcher cannot contain unknown tagged object cases
			{
				success: () => 42,
				unexpected: () => false,
			},
			() => "fallback",
		);

		expect(true).toBe(true);
	});
});
