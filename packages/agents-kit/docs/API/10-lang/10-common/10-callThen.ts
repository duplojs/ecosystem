/**
 * @title DCommon.callThen
 *
 * Appliquer une fonction à une valeur immédiate ou promise, avec gestion optionnelle des erreurs.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DCommon.callThen("value", DString.toUpperCase);

// Une valeur immédiate reste immédiate après l’application de la fonction.
type _CheckResult = DCommon.ExpectType<typeof result, Uppercase<string>, "strict">;

declare const promisedValue: Promise<string>;
const promisedResult = DCommon.callThen(promisedValue, DString.toUpperCase);

// Une Promise conserve son caractère asynchrone.
type _CheckPromisedResult = DCommon.ExpectType<
	typeof promisedResult,
	Promise<Uppercase<string>>,
	"strict"
>;
