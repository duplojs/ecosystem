import * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";

describe("discriminate", () => {
	it("should discriminate an object from a property", () => {
		type Source =
			| {
				type: "created";
				id: 1;
			}
			| {
				type: "deleted";
				id: 2;
			};

		const source = {
			type: "created",
			id: 1,
		} as Source;

		if (DObject.discriminate(source, "type", "created")) {
			expect(source.id).toBe(1);

			type _CheckSource = DCommon.ExpectType<
				typeof source,
				{
					type: "created";
					id: 1;
				},
				"strict"
			>;
		} else {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				{
					type: "deleted";
					id: 2;
				},
				"strict"
			>;
		}
	});

	it("should reject an object with a different property", () => {
		const source = {
			type: "deleted" as "created" | "deleted",
		} as const;

		expect(DObject.discriminate(source, "type", "created")).toBe(false);
	});

	it("should discriminate with a list of values in pipe", () => {
		const source = {
			type: "created",
			id: 1,
		} as const;

		const result = DCommon.pipe(
			source,
			DCommon.when(
				DObject.discriminate("type", ["created"]),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						{
							readonly type: "created";
							readonly id: 1;
						},
						"strict"
					>;

					return value.id;
				},
			),
		);

		expect(result).toBe(1);
	});
});
