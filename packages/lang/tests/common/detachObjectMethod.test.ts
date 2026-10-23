
import * as DCommon from "@scripts/common";

describe("detachObjectMethod", () => {
	it("binds an object method to its owner", () => {
		const user = {
			name: "Jane",
			getName() {
				return this.name;
			},
		};
		const getName = DCommon.detachObjectMethod(user, "getName");

		type _CheckMethod = DCommon.ExpectType<
			typeof getName,
			() => string,
			"strict"
		>;

		expect(getName()).toBe("Jane");
	});
});
