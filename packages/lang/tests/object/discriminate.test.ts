import { DObject, pipe, when, type ExpectType } from "@scripts";

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

			type _CheckSource = ExpectType<
				typeof source,
				{
					type: "created";
					id: 1;
				},
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
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

		const result = pipe(
			source,
			when(
				DObject.discriminate("type", ["created"]),
				(value) => {
					type _CheckValue = ExpectType<
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
