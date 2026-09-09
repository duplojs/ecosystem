import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("record", () => {
	it("creates a record structure from string key and value structures", () => {
		const structure = DDataStructure.record(
			DDataStructure.string(),
			DDataStructure.number(),
		);
		const input = {
			first: 1,
			second: 2,
		};
		const failure = structure.check({
			first: 1,
			second: "invalid",
		});

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.RecordStructure<
				Partial<{ readonly [Prop in string]: number }>,
				readonly []
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			Partial<{ readonly [Prop in string]: number }>,
			"strict"
		>;

		expect(structure.definition.requiredKeys.value).toBeNull();
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: "invalid",
			path: "{record value: second}",
		});
	});

	it("creates a record structure from literal key unions", () => {
		const structure = DDataStructure.record(
			DDataStructure.literal(["name", "role"]),
			DDataStructure.string(),
		);
		const input = {
			name: "Jane",
			role: "admin",
		};

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.RecordStructure<
				{
					readonly name: string;
					readonly role: string;
				},
				readonly []
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly role: string;
			},
			"strict"
		>;

		expect(structure.definition.requiredKeys.value).toStrictEqual(["name", "role"]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is({
			name: "Jane",
			role: 123,
		})).toBe(false);
	});

	it("can be used inside nested object and array helpers", () => {
		const structure = DDataStructure.object({
			users: DDataStructure.array(
				DDataStructure.record(
					DDataStructure.literal(["name", "email"]),
					DDataStructure.string(),
				),
			),
		});
		const input = {
			users: [
				{
					name: "Jane",
					email: "jane@example.com",
				},
			],
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly users: readonly {
					readonly name: string;
					readonly email: string;
				}[];
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check({
					users: [
						{
							name: "Jane",
						},
					],
				}),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: "users.[array: 0].{record value: email}",
		});
	});

	it("keeps direct and added refine constraints coherent", () => {
		interface UserRecord {
			readonly name: string;
			readonly role: string;
		}
		interface AdminRecord {
			readonly name: string;
			readonly role: "admin";
		}

		const directStructure = DDataStructure.record(
			DDataStructure.literal(["name", "role"]),
			DDataStructure.string(),
			[
				DDataStructure.refine(
					(data): data is AdminRecord => {
						type check = ExpectType<
							typeof data,
							UserRecord,
							"strict"
						>;

						return data.role === "admin";
					},
				),
			],
		);
		const addedStructure = DDataStructure.record(
			DDataStructure.literal(["name", "role"]),
			DDataStructure.string(),
		).addConstraint(
			DDataStructure.refine(
				(data): data is AdminRecord => {
					type check = ExpectType<
						typeof data,
						UserRecord,
						"strict"
					>;

					return data.role === "admin";
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.RecordStructure<
				{
					readonly name: string;
					readonly role: string;
				},
				readonly [
					DDataStructure.RefineConstraint<
						{
							readonly name: string;
							readonly role: string;
						},
						AdminRecord
					>,
				]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			UserRecord & AdminRecord,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				{
					readonly name: string;
					readonly role: string;
				},
				DDataStructure.StructureDefinition<
					readonly [
						DDataStructure.RefineConstraint<
							{
								readonly name: string;
								readonly role: string;
							},
							AdminRecord
						>,
					]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			UserRecord & AdminRecord,
			"strict"
		>;

		// @ts-expect-error record structures cannot receive string constraints.
		DDataStructure.record(DDataStructure.string(), DDataStructure.number(), [DDataStructure.email()]);
		// @ts-expect-error record structures cannot add string constraints.
		DDataStructure.record(DDataStructure.string(), DDataStructure.number()).addConstraint(DDataStructure.email());
	});
});
