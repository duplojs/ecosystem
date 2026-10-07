/**
 * @title Conversion des absences et exceptions en résultats.
 *
 * Intégrer des valeurs optionnelles ou des appels pouvant échouer dans un contrat Either.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

// Maybe représente une présence ou une absence : Some<Value> est un Right, None est un Left.
// toMaybe convertit null et undefined en None et les valeurs présentes en Some.
// Un Either déjà construit est transmis tel quel.

declare function someFunction(): string | number | null | undefined;

// DEither.None | DEither.Some<string> | DEither.Some<number>
const resultToMaybe = DEither.toMaybe(someFunction());

interface User {
	name: string;
}
declare function findUser(): DEither.Maybe<User>;

// Une transformation sur Some reçoit le User ; None est transmis sans exécuter la callback.
// DEither.None | DEither.Success<string>
const userName = DCommon.pipe(
	findUser(),
	DEither.whenIsRight((user) => DEither.success(user.name)),
);

// safeCallback transforme une exception en SafeCallbackError, dont la valeur est unknown.
// Une valeur brute devient SafeCallbackSuccess ; un Either retourné est conservé.
// DEither.SafeCallbackError | DEither.SafeCallbackSuccess<"test">
const resultSafeCallback = DEither.safeCallback(
	() => "test" as const,
);
// asyncSafeCallback capture aussi les rejets et retourne toujours une Promise de résultat.
declare function loadValue(): Promise<string>;
const asyncSafeResult = DEither.asyncSafeCallback(loadValue);

// safeCallback gère aussi les promesses, mais une exception synchrone peut produire
// directement un Left : préférer asyncSafeCallback pour un retour toujours asynchrone.
