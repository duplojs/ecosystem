import { DChrono, DCommon, type ExpectType, pipe } from "@scripts";

describe("formData", () => {
	it("creates a form data instance with flattened entries from nested values", () => {
		const avatar = new File(["avatar-content"], "avatar.txt", { type: "text/plain" });
		const createdDate = DChrono.createDateOrThrow(1_735_689_600_000);
		const createdTime = DChrono.createTimeOrThrow(45_000_000);
		const input = {
			name: "Jane",
			enabled: true,
			age: 25,
			emptyValue: null,
			createdDate,
			createdTime,
			profile: {
				avatar,
				tags: ["core", undefined, "lang"],
			},
			empty: undefined,
		};
		const result = DCommon.createFormData(input);

		type _CheckResult = ExpectType<
			typeof result,
			DCommon.TheFormData<typeof input>,
			"strict"
		>;

		expect(result).toBeInstanceOf(DCommon.TheFormData);
		expect(result.inputValues).toBe(input);
		expect(Array.from(result.entries())).toStrictEqual([
			["name", "Jane"],
			["enabled", "true"],
			["age", "25"],
			["emptyValue", "null"],
			["createdDate", createdDate.toString()],
			["createdTime", createdTime.toString()],
			["profile/*\\avatar", avatar],
			["profile/*\\tags/*\\[0]", "core"],
			["profile/*\\tags/*\\[2]", "lang"],
		]);
	});

	it("supports root primitives, files and arrays in flat entries", () => {
		const file = new File(["content"], "file.txt", { type: "text/plain" });

		expect(Array.from(DCommon.TheFormData.toFlatEntries("value"))).toStrictEqual([["", "value"]]);
		expect(Array.from(DCommon.TheFormData.toFlatEntries(file))).toStrictEqual([["", file]]);
		expect(Array.from(DCommon.TheFormData.toFlatEntries(null))).toStrictEqual([["", "null"]]);
		expect(Array.from(DCommon.TheFormData.toFlatEntries(undefined))).toStrictEqual([]);
		expect(Array.from(DCommon.TheFormData.toFlatEntries(["first", undefined, "third"]))).toStrictEqual([
			["[0]", "first"],
			["[2]", "third"],
		]);
	});

	it("reconstructs nested objects from flat entries and ignores unsafe keys", () => {
		const result = DCommon.TheFormData.fromEntries(
			[
				["user/*\\name", "Jane"],
				["user/*\\tags/*\\[0]", "core"],
				["user/*\\tags/*\\[1]", "lang"],
				["user/*\\tags/*\\[20]", "ignored"],
				["__proto__/*\\polluted", "ignored"],
				["constructor/*\\prototype", "ignored"],
			],
			10,
		);

		expect(result).toStrictEqual({
			user: {
				name: "Jane",
				tags: ["core", "lang"],
			},
		});
	});

	it("returns an empty object from empty entries", () => {
		const result = DCommon.TheFormData.fromEntries(
			[],
			10,
		);

		expect(result).toStrictEqual({});
	});

	it("can be used in a pipe", () => {
		const result = pipe(
			{
				name: "Jane",
			},
			DCommon.createFormData,
		);

		expect(result.get("name")).toBe("Jane");
	});
});
