import * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import * as DObject from "@scripts/object";
import * as DPattern from "@scripts/pattern";

describe("matchWithTaggedObjectOtherwise", () => {
	interface Success extends DModeling.ObjectTag<"success"> {
		id: string;
		value: number;
	}

	interface Failure extends DModeling.ObjectTag<"failure"> {
		id: string;
		error: string;
	}

	type Input = Success | Failure;
	type TransformedSuccess = DCommon.SimplifyTopLevel<
		& Omit<Success, "id">
		& { id: number }
	>;
	type TransformedFailure = DCommon.SimplifyTopLevel<
		& Omit<Failure, "id">
		& { id: boolean }
	>;
	type TransformedInput = TransformedSuccess | TransformedFailure;

	it("should match a handled tagged object and narrow both callbacks", () => {
		const input = DModeling.taggedObject("success", {
			id: "item-id",
			value: 42,
		}) as Input;

		const result = DPattern.matchWithTaggedObjectOtherwise(input, {
			success: (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					Success,
					"strict"
				>;

				return value.value;
			},
		}, (value) => {
			type check = DCommon.ExpectType<
				typeof value,
				Failure,
				"strict"
			>;

			return value.error;
		});

		expect(result).toBe(42);

		type check = DCommon.ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should delegate an unhandled tagged object in pipe", () => {
		const input = DModeling.taggedObject("failure", {
			id: "item-id",
			error: "failed",
		}) as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithTaggedObjectOtherwise({
				success: (value) => {
					type check = DCommon.ExpectType<
						typeof value,
						Success,
						"strict"
					>;

					return value.value;
				},
			}, (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					Failure,
					"strict"
				>;

				return value.error;
			}),
		);

		expect(result).toBe("failed");

		type check = DCommon.ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should infer handled and unhandled tagged objects passed directly to curried functions in pipe", () => {
		const input = DModeling.taggedObject(
			"failure",
			{
				id: "item-id",
				error: "failed",
			},
		) as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithTaggedObjectOtherwise(
				{
					success: DObject.transformProperties({
						id: (value) => {
							type check = DCommon.ExpectType<
								typeof value,
								string,
								"strict"
							>;

							return value.length;
						},
					}),
				},
				DObject.transformProperties({
					id: (value) => {
						type check = DCommon.ExpectType<
							typeof value,
							string,
							"strict"
						>;

						return value.length > 0;
					},
				}),
			),
		);

		expect(result.id).toBe(true);

		type check = DCommon.ExpectType<
			typeof result,
			TransformedInput,
			"strict"
		>;
	});

	it("should reject matcher keys outside the input tags", () => {
		const input = DModeling.taggedObject("success", {
			id: "item-id",
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
