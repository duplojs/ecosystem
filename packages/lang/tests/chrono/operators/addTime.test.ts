import { type ExpectType, DChrono } from "@scripts";

describe("addTime", () => {
	it("adds a TheTime to a TheDate", () => {
		const result = DChrono.addTime("date1000+", "time2000+");

		expect(DChrono.serialize(result)).toBe("date3000+");

		type check = ExpectType<
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

		type check = ExpectType<
			typeof result,
			DChrono.TheTime,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = DChrono.addTime("time1000+")("date2000+");

		expect(DChrono.serialize(result)).toBe("date3000+");
	});
});
