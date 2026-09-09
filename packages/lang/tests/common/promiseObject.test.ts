import { DCommon, type ExpectType } from "@scripts";

describe("promiseObject", () => {
	it("awaits every promised property and keeps direct values", async() => {
		const result = DCommon.promiseObject({
			id: Promise.resolve(1 as const),
			name: "Jane" as const,
			active: Promise.resolve(true as const),
		});

		type _CheckResult = ExpectType<
			typeof result,
			Promise<{
				id: 1;
				name: "Jane";
				active: true;
			}>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual({
			id: 1,
			name: "Jane",
			active: true,
		});
	});

	it("supports empty objects", async() => {
		await expect(DCommon.promiseObject({})).resolves.toStrictEqual({});
	});
});
