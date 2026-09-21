import { type BodyControllerParams, bodyResultKind, controlBodyAsText, createBodyController, WrongBodyReaderImplementationError } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

describe("createBodyController", () => {
	interface TestParams extends BodyControllerParams {
		test: string;
	}

	const BodyController = createBodyController<"test", TestParams>("test");

	it("check name", () => {
		expect(BodyController.name).toStrictEqual("test");
	});

	it("create bodyController", () => {
		const bodyController = BodyController.create({ test: "" });
		expect(bodyController.name).toStrictEqual("test");
		expect(bodyController.params).toStrictEqual({ test: "" });
	});

	it("create createReaderImplementation", () => {
		const spy = vi.fn();
		const bodyReaderImplementation = BodyController.createReaderImplementation(spy);
		expect(bodyReaderImplementation.read).toStrictEqual(spy);
	});

	it("bodyController tryToCreateReader", () => {
		const bodyController = BodyController.create({ test: "" });
		expect(bodyController.tryToCreateReader({} as never)).toStrictEqual(DEither.fail());
		const bodyReaderImplementation = BodyController.createReaderImplementation(vi.fn());
		expect(
			bodyController.tryToCreateReader(bodyReaderImplementation),
		).toStrictEqual(DEither.success(expect.any(Object)));
	});

	it("bodyController createReaderOrThrow", () => {
		const bodyController = BodyController.create({ test: "" });
		expect(() => bodyController.createReaderOrThrow({} as never)).toThrowError(WrongBodyReaderImplementationError);
		const bodyReaderImplementation = BodyController.createReaderImplementation(vi.fn());
		expect(bodyController.tryToCreateReader(bodyReaderImplementation)).toStrictEqual(expect.any(Object));
	});

	it("WrongBodyReaderImplementationError", () => {
		expect(new WrongBodyReaderImplementationError("test", {} as never)).instanceOf(Error);
	});

	it("reader", () => {
		const bodyController = BodyController.create({ test: "" });
		const spy = vi.fn();
		const bodyReaderImplementation = BodyController.createReaderImplementation(spy);
		const reader = bodyController.tryToCreateReader(bodyReaderImplementation);
		DCommon.asserts(reader, DEither.isRight);
		const result = DEither.unwrapRight(reader).getResult({} as never);
		expect(spy).toHaveBeenCalledTimes(1);

		expect(result).toStrictEqual(
			expect.objectContaining({ [bodyResultKind.runTimeKey]: null }),
		);
	});

	it("result right", async() => {
		const bodyController = BodyController.create({ test: "" });
		const bodyReaderImplementation = BodyController.createReaderImplementation(
			() => Promise.resolve(DEither.success("1")),
			DDataStructure.codecsString,
		);
		const reader = bodyController.createReaderOrThrow(bodyReaderImplementation);
		const bodyResult = reader.getResult({} as never);

		const numberParseFunction = DDataStructure.number().asyncParse;
		const result1 = await bodyResult.extract(DCommon.forward, numberParseFunction);
		expect(result1).toStrictEqual(
			DEither.right("parse-success", 1),
		);

		const undefinedParseFunction = DDataStructure.undefined().asyncParse;
		const result2 = await bodyResult.extract(DCommon.forward, undefinedParseFunction);
		expect(result2).toStrictEqual(
			DEither.left("parse-error", expect.any(DDataStructure.Error)),
		);
	});

	it("result left", async() => {
		const bodyController = BodyController.create({ test: "" });
		const bodyReaderImplementation = BodyController.createReaderImplementation(
			() => Promise.resolve(DEither.left("reader-error", new Error())),
		);
		const reader = bodyController.createReaderOrThrow(bodyReaderImplementation);
		const bodyResult = reader.getResult({} as never);

		const stringParseFunction = DDataStructure.string().asyncParse;
		const result1 = await bodyResult.extract(DCommon.forward, stringParseFunction);
		expect(result1).toStrictEqual(
			DEither.left("reader-error", expect.any(Error)),
		);
	});

	it("is", () => {
		const bodyController = BodyController.create({ test: "" });

		expect(BodyController.is(bodyController)).toStrictEqual(true);
		expect(BodyController.is(controlBodyAsText())).toStrictEqual(false);
	});
});
