import type * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";

describe("is", () => {
	it.each([
		{ input: {} },
		{ input: { name: "Duplo" } },
		{ input: Object.create(null) },
		{ input: [] },
		{ input: new Date() },
		{ input: new Map() },
		{ input: new Set() },
		{ input: /value/ },
		{
			input: {
				*[Symbol.iterator]() {
					yield "value";
				},
			},
		},
	])("should accept object input $input", ({ input }) => {
		const result = DObject.is(input);

		expect(result).toBe(true);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
	});

	it.each([
		{ input: null },
		{ input: undefined },
		{ input: "value" },
		{ input: 42 },
		{ input: true },
		{ input: 42n },
		{ input: Symbol("value") },
		{ input: () => true },
	])("should reject non object input $input", ({ input }) => {
		expect(DObject.is(input)).toBe(false);
	});

	it.each([
		{ input: { name: "Duplo" } },
		{ input: "value" },
	])("should narrow an unknown input $input", ({ input: value }) => {
		const input: unknown = value;

		if (DObject.is(input)) {
			type _CheckInput = DCommon.ExpectType<typeof input, object, "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, unknown, "strict">;
		}
	});

	it.each([
		{ input: { name: "Duplo" } },
		{ input: [] },
		{ input: new Date() },
		{ input: "value" },
		{ input: null },
	])("should discriminate objects from a union for $input", ({ input: value }) => {
		const input = value as { name: string } | readonly number[] | Date | string | null;

		if (DObject.is(input)) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				{ name: string } | readonly number[] | Date,
				"strict"
			>;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, string | null, "strict">;
		}
	});
});
