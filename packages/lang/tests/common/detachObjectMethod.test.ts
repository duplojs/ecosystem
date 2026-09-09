import { DCommon, type ExpectType } from "@scripts";

describe("detachObjectMethod", () => {
	it("binds an object method to its owner", () => {
		const user = {
			name: "Jane",
			getName() {
				return this.name;
			},
		};
		const getName = DCommon.detachObjectMethod(user, "getName");

		type _CheckMethod = ExpectType<
			typeof getName,
			() => string,
			"strict"
		>;

		expect(getName()).toBe("Jane");
	});
});
