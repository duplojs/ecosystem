import { ResponseContract } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("ResponseContract", () => {
	it("creates contract for 201 Created", () => {
		const contract = ResponseContract.created("resource created", DDataStructure.string());

		expect(contract).toStrictEqual({
			code: "201",
			information: "resource created",
			body: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check1 = DCommon.ExpectType<
			typeof contract,
			ResponseContract.Contract<
				"201",
				"resource created",
				DDataStructure.TypeStructure<string, readonly []>
			>,
			"strict"
		>;

		const contractWithEmptySchema = ResponseContract.created("resource created");

		expect(contractWithEmptySchema).toStrictEqual({
			code: "201",
			information: "resource created",
			body: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check2 = DCommon.ExpectType<
			typeof contractWithEmptySchema,
			ResponseContract.Contract<
				"201",
				"resource created",
				DDataStructure.TypeStructure<undefined, readonly []>
			>,
			"strict"
		>;
	});

	it("create contract with no body", () => {
		const contract = ResponseContract.noContent("my super information");

		expect(contract).toStrictEqual({
			code: "204",
			information: "my super information",
			body: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check = DCommon.ExpectType<
			typeof contract,
			ResponseContract.Contract<
				"204",
				"my super information",
				DDataStructure.TypeStructure<undefined, readonly []>
			>,
			"strict"
		>;
	});

	it("create contract for 200 ok", () => {
		const contract = ResponseContract.ok("my super information", DDataStructure.string());

		expect(contract).toStrictEqual({
			code: "200",
			information: "my super information",
			body: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check = DCommon.ExpectType<
			typeof contract,
			ResponseContract.Contract<
				"200",
				"my super information",
				DDataStructure.TypeStructure<string, readonly []>
			>,
			"strict"
		>;
	});

	it("create server sent events contract", () => {
		const mainEventSchema = DDataStructure.string();
		const pingEventSchema = DDataStructure.object({
			value: DDataStructure.number(),
		});

		const contract = ResponseContract.serverSentEvents(
			"my super information",
			mainEventSchema,
			{ ping: pingEventSchema },
		);

		expect(contract).toStrictEqual({
			code: "200",
			information: "my super information",
			events: {
				ping: pingEventSchema,
				message: mainEventSchema,
			},
			body: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			[ResponseContract.serverSentEventsContractKind.runTimeKey]: null,
		});

		type Check = DCommon.ExpectType<
			typeof contract,
			ResponseContract.ServerSentEventsContract<
				"200",
				"my super information",
				{
					ping: typeof pingEventSchema;
				} & {
					message: typeof mainEventSchema;
				},
				DDataStructure.TypeStructure<undefined, readonly []>
			>,
			"strict"
		>;
	});

	it("create stream contract", () => {
		const flux = DDataStructure.object({
			value: DDataStructure.number(),
		});

		const contract = ResponseContract.stream("my super information", flux);

		expect(contract).toStrictEqual({
			code: "200",
			information: "my super information",
			flux,
			body: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			[ResponseContract.streamContractKind.runTimeKey]: null,
		});

		type Check = DCommon.ExpectType<
			typeof contract,
			ResponseContract.StreamContract<
				"200",
				"my super information",
				typeof flux,
				DDataStructure.TypeStructure<undefined, readonly []>
			>,
			"strict"
		>;
	});

	it("create stream text contract", () => {
		const contract = ResponseContract.streamText("my super information");

		expect(contract).toStrictEqual({
			code: "200",
			information: "my super information",
			flux: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			body: expect.objectContaining({
				[DDataStructure.typeStructureKind.runTimeKey]: null,
			}),
			[ResponseContract.streamTextContractKind.runTimeKey]: null,
		});

		type Check = DCommon.ExpectType<
			typeof contract,
			ResponseContract.StreamTextContract<
				"200",
				"my super information",
				DDataStructure.TypeStructure<string, readonly []>,
				DDataStructure.TypeStructure<undefined, readonly []>
			>,
			"strict"
		>;
	});

	it("error", () => {
		const error = new ResponseContract.Error("test", "");

		expect(error).instanceof(Error);
	});
});
