import * as DChrono from "@scripts/chrono";
import * as DCommon from "@scripts/common";

describe("addTime", () => {
	it("adds a TheTime to a TheDate", () => {
		const result = DChrono.addTime("date1000+", "time2000+");

		expect(DChrono.serialize(result)).toBe("date3000+");

		type check = DCommon.ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("adds a TheTime to a TheDate instance", () => {
		const result = DChrono.addTime(
			DChrono.createDate("1970-01-01"),
			"time2000+",
		);

		expect(DChrono.serialize(result)).toBe("date2000+");
	});

	it("adds a negative TheTime to a TheDate", () => {
		const result = DChrono.addTime("date1000+", "time1500-");

		expect(DChrono.serialize(result)).toBe("date500-");
	});

	it("adds two TheTime values", () => {
		const result = DChrono.addTime("time1000+", "time500-");

		expect(DChrono.serialize(result)).toBe("time500+");

		type check = DCommon.ExpectType<
			typeof result,
			DChrono.TheTime,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = DCommon.pipe(
			"date2000+",
			DChrono.addTime("time1000+"),
		);

		expect(DChrono.serialize(result)).toBe("date3000+");
	});

	it("infers a TheTime in pipe with a serialized input", () => {
		const result = DCommon.pipe("time1000+" as const, DChrono.addTime("time500-"));

		expect(DChrono.serialize(result)).toBe("time500+");

		type _CheckResult = DCommon.ExpectType<typeof result, DChrono.TheTime, "strict">;
	});

	it("adds a TheTime instance without mutating either operand", () => {
		const input = DChrono.createTimeOrThrow(1000);
		const time = DChrono.createTimeOrThrow(-500);
		const result = DChrono.addTime(input, time);

		expect(DChrono.serialize(result)).toBe("time500+");
		expect(DChrono.serialize(input)).toBe("time1000+");
		expect(DChrono.serialize(time)).toBe("time500-");

		type _CheckResult = DCommon.ExpectType<typeof result, DChrono.TheTime, "strict">;
	});

	it("distributes date and time unions in direct and curried declarations", () => {
		const input = "time1000+" as DChrono.SerializedTheDate | DChrono.SerializedTheTime;
		const direct = DChrono.addTime(input, "time500+");
		const curried = DCommon.pipe(input, DChrono.addTime("time500+"));

		expect(direct.toJSON()).toBe("time1500+");
		expect(curried.toJSON()).toBe("time1500+");

		type _CheckDirect = DCommon.ExpectType<typeof direct, DChrono.TheDate | DChrono.TheTime, "strict">;
		type _CheckCurried = DCommon.ExpectType<typeof curried, DChrono.TheDate | DChrono.TheTime, "strict">;
	});
});
