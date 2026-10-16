import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { describe, expect, it } from "vitest";

interface User {
	id: number;
	email: string;
}

// Les résultats possibles sont inférés à partir des branches de la fonction.
function findUserByEmail(email: string) {
	if (email === "") {
		return DEither.error(new Error("Email is required"));
	}
	const user = {
		id: 1,
		email: "jane@duplo.dev",
	};
	if (email === user.email) {
		return DEither.result("user.found", user);
	}
	return DEither.left("user.notfound", email);
}

describe("findUserByEmail", () => {
	it("selects the expected information and checks its value", () => {
		const result = findUserByEmail("jane@duplo.dev");
		const user = DEither.unwrapByInformationOrThrow(result, "user.found");

		expect(user).toStrictEqual({
			id: 1,
			email: "jane@duplo.dev",
		});

		type _CheckUser = DCommon.ExpectType<typeof user, User, "strict">;
	});

	it("extracts an expected business failure", () => {
		const result = findUserByEmail("missing@duplo.dev");
		const email = DEither.unwrapByInformationOrThrow(result, "user.notfound");

		expect(email).toBe("missing@duplo.dev");

		type _CheckEmail = DCommon.ExpectType<typeof email, string, "strict">;
	});

	it("checks an expected error payload", () => {
		const result = findUserByEmail("");
		const error = DEither.unwrapByInformationOrThrow(result, "error");

		expect(error).toBeInstanceOf(Error);
		expect(error.message).toBe("Email is required");
	});

	it("monitors all possible information before extracting the user", () => {
		const result = findUserByEmail("jane@duplo.dev");
		// Une nouvelle information dans les résultats inférés de la fonction
		// impose de revoir les cas acceptés ou rejetés à cet endroit.
		const user = DEither.unwrapSelectionOrThrow(result, {
			"user.found": true,
			"user.notfound": false,
			error: false,
		});

		expect(user).toStrictEqual({
			id: 1,
			email: "jane@duplo.dev",
		});

		type _CheckUser = DCommon.ExpectType<typeof user, User, "strict">;
	});

	it("fails when an excluded information is returned", () => {
		const result = findUserByEmail("missing@duplo.dev");

		expect(
			() => DEither.unwrapSelectionOrThrow(result, {
				"user.found": true,
				"user.notfound": false,
				error: false,
			}),
		).toThrow(DEither.HasNotSelectedInformationError);
	});

	it("preserves inference when selecting in a pipe", () => {
		const user = DCommon.pipe(
			findUserByEmail("jane@duplo.dev"),
			DEither.unwrapByInformationOrThrow("user.found"),
		);

		expect(user.email).toBe("jane@duplo.dev");

		type _CheckUser = DCommon.ExpectType<typeof user, User, "strict">;
	});
});
