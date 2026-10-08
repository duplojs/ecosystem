/**
 * @title Tester un résultat Either
 *
 * Sélectionner l'`information` attendue, unwrap la valeur correspondante puis
 * vérifier la donnée obtenue et son type. Les helpers `OrThrow` font échouer le
 * test quand le résultat n'est pas celui visé.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

// Dans les tests du monorepo, Vitest expose ces globals directement.
// Ces déclarations rendent uniquement l'exemple typable dans `ai-docs`.
declare const describe: (title: string, body: () => void) => void;
declare const it: (title: string, body: () => void | Promise<void>) => void;
declare const expect: (value: unknown) => {
	toBe(expected: unknown): void;
	toStrictEqual(expected: unknown): void;
};

interface User {
	id: number;
	email: string;
}

declare function findUserByEmail(
	email: string,
): (
	| DEither.Result<"user.found", User>
	| DEither.Left<"user.notfound", string>
	| DEither.Error<Error>
);

// L'unwrap exprime la branche attendue avant l'assertion sur la donnée.
describe("findUserByEmail", () => {
	it("returns the found user", () => {
		const result = findUserByEmail("jane@duplo.dev");

		const user = DEither.unwrapByInformationOrThrow(
			result,
			"user.found",
		);

		expect(user).toStrictEqual({
			id: 1,
			email: "jane@duplo.dev",
		});

		type _CheckUser = DCommon.ExpectType<
			typeof user,
			User,
			"strict"
		>;
	});

	it("returns the not found email", () => {
		const result = findUserByEmail("missing@duplo.dev");

		const email = DEither.unwrapByInformationOrThrow(
			result,
			"user.notfound",
		);

		expect(email).toBe("missing@duplo.dev");
	});
});

// La sélection rend explicites les branches acceptées par ce test.
describe("findUserByEmail selection", () => {
	it("accepts only the business results handled by this test", () => {
		const result = findUserByEmail("jane@duplo.dev");

		const value = DEither.unwrapSelectionOrThrow(
			result,
			{
				"user.found": true,
				"user.notfound": true,
				error: false,
			},
		);

		type _CheckValue = DCommon.ExpectType<
			typeof value,
			User | string,
			"strict"
		>;

		if (typeof value === "string") {
			expect(value).toBe("jane@duplo.dev");
		} else {
			expect(value).toStrictEqual({
				id: 1,
				email: "jane@duplo.dev",
			});
		}
	});
});

// `DEither.expect` matérialise dans le type qu'une valeur est déjà un `Either`.
describe("DEither.expect", () => {
	it("keeps the exact either type", () => {
		const input = DEither.success(42);
		const result = DEither.expect(input);

		expect(result).toBe(input);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;

		// @ts-expect-error input must be an Either
		DEither.expect("plain value");
	});
});

// Tester une API curifiée dans son contexte réel conserve l'inférence utile.
describe("curried Either helpers", () => {
	it("preserves inference in a pipe", () => {
		const result = DCommon.pipe(
			findUserByEmail("jane@duplo.dev"),
			DEither.unwrapByInformationOrThrow("user.found"),
		);

		expect(result.email).toBe("jane@duplo.dev");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			User,
			"strict"
		>;
	});
});
