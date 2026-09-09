import { DModeling, DPattern, pipe, type ExpectType } from "@scripts";

describe("matchWithTaggedObject", () => {
	interface Success extends DModeling.ObjectTag<"success"> {
		value: number;
	}

	interface Failure extends DModeling.ObjectTag<"failure"> {
		error: string;
	}

	type Input = Success | Failure;

	it("should call the matching handler with the narrowed tagged object in classic form", () => {
		const input = DModeling.taggedObject(
			"failure",
			{ error: "failed" },
		) as Input;

		const result = DPattern.matchWithTaggedObject(input, {
			success: (value) => {
				type check = ExpectType<
					typeof value,
					Success,
					"strict"
				>;

				return 42 as const;
			},
			failure: (value) => {
				type check = ExpectType<
					typeof value,
					Failure,
					"strict"
				>;

				return value.error;
			},
		});

		expect(result).toBe("failed");

		type check = ExpectType<
			typeof result,
			42 | string,
			"strict"
		>;
	});

	it("should work in pipe with the curried form", () => {
		const input = DModeling.taggedObject("success", {
			value: 42,
		}) as Input;

		const result = pipe(
			input,
			DPattern.matchWithTaggedObject({
				success: (value) => {
					type check = ExpectType<
						typeof value,
						Success,
						"strict"
					>;

					return value.value;
				},
				failure: (value) => {
					type check = ExpectType<
						typeof value,
						Failure,
						"strict"
					>;

					return value.error;
				},
			}),
		);

		expect(result).toBe(42);

		type check = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should reject non-specific tagged objects in classic and curried forms", () => {
		const input = DModeling.taggedObject("success", {
			value: 42,
		}) as DModeling.ObjectTag;

		// @ts-expect-error input must be a tagged object literal union
		DPattern.matchWithTaggedObject(input, {
			success: () => 42,
		});

		pipe(
			// @ts-expect-error curried matcher only accepts its tagged object literal keys
			input,
			DPattern.matchWithTaggedObject({
				success: () => 42,
			}),
		);

		expect(true).toBe(true);
	});

	it("should reject matchers with missing or additional keys", () => {
		const input = DModeling.taggedObject("success", {
			value: 42,
		}) as Input;

		// @ts-expect-error matcher must handle every input tag
		DPattern.matchWithTaggedObject(input, {
			success: () => 42,
		});

		// @ts-expect-error matcher cannot declare keys outside the input tags
		DPattern.matchWithTaggedObject(input, {
			success: () => 42,
			failure: () => "failed",
			unexpected: () => false,
		});

		pipe(
			input,
			// @ts-expect-error curried matcher must handle every piped input tag
			DPattern.matchWithTaggedObject({
				success: () => 42,
			}),
		);
		pipe(
			input,
			DPattern.matchWithTaggedObject(
				// @ts-expect-error curried matcher cannot declare keys outside its input tags
				{
					success: () => 42,
					failure: () => "failed",
					unexpected: () => false,
				},
			),
		);

		expect(true).toBe(true);
	});
});
