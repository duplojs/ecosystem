import { type ExpectType, DChrono } from "@scripts";

describe("subtractTime", () => {
	it("subtracts a TheTime from a TheDate", () => {
		const result = DChrono.subtractTime("date3000+", "time2000+");

		expect(DChrono.serialize(result)).toBe("date1000+");

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("subtracts a TheTime from a TheDate instance", () => {
		const result = DChrono.subtractTime(
			DChrono.createDate("1970-01-01"),
			"time2000+",
		);

		expect(DChrono.serialize(result)).toBe("date2000-");
	});

	it("subtracts a negative TheTime from a TheDate", () => {
		const result = DChrono.subtractTime("date1000+", "time1500-");

		expect(DChrono.serialize(result)).toBe("date2500+");
	});

	it("subtracts two TheTime values", () => {
		const result = DChrono.subtractTime("time1000+", "time500+");

		expect(DChrono.serialize(result)).toBe("time500+");

		type check = ExpectType<
			typeof result,
			DChrono.TheTime,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = DChrono.subtractTime("time1000+")("date2000+");

		expect(DChrono.serialize(result)).toBe("date1000+");
	});
});
