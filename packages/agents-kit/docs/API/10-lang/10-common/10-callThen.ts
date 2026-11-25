/**
 * @title DCommon.callThen
 *
 * Appliquer une fonction à une valeur immédiate ou promise, avec gestion optionnelle des erreurs.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

// Valeur immédiate : "VALUE".
const result = DCommon.callThen("value", DString.toUpperCase);
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Uppercase<string>,
	"strict"
>;

// Une Promise en entrée conserve un résultat asynchrone.
declare const promisedValue: Promise<string>;
const promisedResult = DCommon.callThen(promisedValue, DString.toUpperCase);
type _CheckPromisedResult = DCommon.ExpectType<
	typeof promisedResult,
	Promise<Uppercase<string>>,
	"strict"
>;

// Avec capture, le getter sans paramètre est exécuté et ses exceptions sont capturées.
const fromGetter = DCommon.callThen(
	() => "value",
	DString.toUpperCase,
	(): "recovered" => "recovered",
);
type _CheckFromGetter = DCommon.ExpectType<
	typeof fromGetter,
	Uppercase<string> | "recovered",
	"strict"
>;

// Avec une Promise, la capture traite aussi les rejets du traitement.
const recoveredPromise = DCommon.callThen(
	promisedValue,
	DString.toUpperCase,
	(): "recovered" => "recovered",
);
type _CheckRecoveredPromise = DCommon.ExpectType<
	typeof recoveredPromise,
	Promise<Uppercase<string> | "recovered">,
	"strict"
>;

// Un getter asynchrone peut lever avant de retourner sa Promise.
const fromAsyncGetter = DCommon.callThen(
	() => Promise.resolve("value"),
	DString.toUpperCase,
	(): "recovered" => "recovered",
);
type _CheckFromAsyncGetter = DCommon.ExpectType<
	typeof fromAsyncGetter,
	Promise<Uppercase<string> | "recovered"> | "recovered",
	"strict"
>;

// Pour une entrée immédiate, un rejet asynchrone du traitement n'est pas capturé.
