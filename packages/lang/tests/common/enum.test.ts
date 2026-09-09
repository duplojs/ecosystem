import { DCommon, type ExpectType } from "@scripts";

describe("enum", () => {
	it("creates an enum object with helpers", () => {
		const status = DCommon.createEnum([
			"pending",
			"done",
		] as const);

		type _CheckValue = ExpectType<
			DCommon.GetEnumValue<typeof status>,
			"pending" | "done",
			"strict"
		>;

		expect(status.pending).toBe("pending");
		expect(status.done).toBe("done");
		expect(status.toTuple()).toStrictEqual(["pending", "done"]);
		expect(status.has("pending")).toBe(true);
		expect(status.has("missing")).toBe(false);
	});

	it("narrows values with has", () => {
		const status = DCommon.createEnum([
			"pending",
			"done",
		] as const);

		const parse = (input: "pending" | "done" | "missing") => {
			if (status.has(input)) {
				type _CheckInput = ExpectType<
					typeof input,
					"pending" | "done",
					"strict"
				>;

				return input;
			} else {
				type _CheckInput = ExpectType<
					typeof input,
					"missing",
					"strict"
				>;

				return "fallback";
			}
		};

		expect(parse("pending")).toBe("pending");
		expect(parse("missing")).toBe("fallback");
	});

	it("returns a compatible enum from contract", () => {
		const status = DCommon.createEnum([
			"pending",
			"done",
		] as const);
		const result = status.contract<"pending" | "done">();

		type _CheckResult = ExpectType<
			typeof result,
			typeof status,
			"strict"
		>;

		expect(result).not.toBe(status);
		expect(result.toTuple()).toStrictEqual(["pending", "done"]);
	});

	it("rejects invalid contracts at type level", () => {
		const status = DCommon.createEnum([
			"pending",
			"done",
		] as const);
		const duplicated = DCommon.createEnum([
			"pending",
			"pending",
		] as const);

		if (false) {
			// @ts-expect-error missing enum value in contract.
			status.contract<"pending">();

			// @ts-expect-error unknown enum value in contract.
			status.contract<"pending" | "done" | "missing">();

			// @ts-expect-error duplicated enum values are rejected by contract.
			duplicated.contract<"pending">();
		}
	});
});
