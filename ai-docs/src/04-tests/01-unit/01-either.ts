/**
 * @title Tester un résultat Either
 *
 * Un test qui reçoit un `Either` doit d'abord exprimer quel résultat il
 * attend. Dans DuploJS, cette intention passe le plus souvent par
 * l'`information` portée par la monade.
 *
 * Le pattern habituel consiste à sélectionner l'information attendue, unwrap
 * sa valeur, puis vérifier uniquement la donnée obtenue. Si le résultat n'est
 * pas celui attendu, les helpers `OrThrow` font échouer le test avant
 * l'assertion finale.
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

// Le test ne vérifie pas l'implémentation interne de la monade.
// Il s'appuie sur `DEither` comme passe-plat : si l'information attendue
// n'est pas présente, l'unwrap échoue déjà.
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

// Quand le test accepte plusieurs résultats possibles, la sélection rend la
// décision explicite. Les résultats marqués `true` sont unwrap. Les autres
// font échouer le test.
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

// `DEither.expect` sert surtout quand le contrat dit qu'une valeur est déjà un
// `Either` et que le test veut matérialiser cette garantie dans le typage.
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

// Pour une API curifiée, le test de typage doit rester dans le contexte réel
// d'utilisation. Ici, `unwrapByInformationOrThrow` est testé dans `pipe`.
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
