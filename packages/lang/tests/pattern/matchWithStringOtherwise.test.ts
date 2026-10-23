import * as DCommon from "@scripts/common";
import * as DPattern from "@scripts/pattern";
import type * as DString from "@scripts/string";

describe("matchWithStringOtherwise", () => {
	it("should match a handled string and narrow both callbacks", () => {
		const input = "success" as "success" | "failure";
		const result = DPattern.matchWithStringOtherwise(input, {
			success: (value) => {
				type check = DCommon.ExpectType<typeof value, "success", "strict">;
				return 42 as const;
			},
		}, (value) => {
			type check = DCommon.ExpectType<typeof value, "failure", "strict">;
			return "fallback" as const;
		});

		expect(result).toBe(42);
		type check = DCommon.ExpectType<typeof result, 42 | "fallback", "strict">;
	});

	it("should delegate an unhandled string in pipe", () => {
		const result = DCommon.pipe(
			"failure" as "success" | "failure",
			DPattern.matchWithStringOtherwise({ success: () => 42 as const }, (value) => {
				type check = DCommon.ExpectType<typeof value, "failure", "strict">;
				return value;
			}),
		);
		expect(result).toBe("failure");
		type check = DCommon.ExpectType<typeof result, 42 | "failure", "strict">;
	});

	it("should support constrained string unions in classic and curried forms", () => {
		const input = "failure" as ("success" | "failure") & DString.NotEmpty;
		const classicResult = DPattern.matchWithStringOtherwise(input, {
			success: (value) => {
				type check = DCommon.ExpectType<typeof value, "success", "strict">;
				return value;
			},
		}, (value) => {
			type check = DCommon.ExpectType<
				typeof value,
				"failure" & DString.NotEmpty,
				"strict"
			>;
			return value;
		});
		const curriedResult = DCommon.pipe(
			input,
			DPattern.matchWithStringOtherwise({
				success: (value) => {
					type check = DCommon.ExpectType<typeof value, "success", "strict">;
					return value;
				},
			}, (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					"failure" & DString.NotEmpty,
					"strict"
				>;
				return value;
			}),
		);

		expect(classicResult).toBe("failure");
		expect(curriedResult).toBe("failure");
		type classicCheck = DCommon.ExpectType<
			typeof classicResult,
			"success" | ("failure" & DString.NotEmpty),
			"strict"
		>;
		type curriedCheck = DCommon.ExpectType<
			typeof curriedResult,
			"success" | ("failure" & DString.NotEmpty),
			"strict"
		>;
	});

	it("should reject matcher keys outside the input union", () => {
		DPattern.matchWithStringOtherwise(
			"success" as "success" | "failure",
			// @ts-expect-error matcher cannot contain unknown string cases
			{
				success: () => 42,
				unexpected: () => false,
			},
			() => "fallback",
		);
		expect(true).toBe(true);
	});
});
