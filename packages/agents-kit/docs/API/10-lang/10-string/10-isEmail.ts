/**
 * @title DString.isEmail
 *
 * Vérifier qu'une chaîne respecte le format d'une adresse e-mail.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isEmail(value)) {
	// Le test établit la contrainte Email dans cette branche.
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Email, "strict">;
}

const result = DString.isEmail("contact@duplojs.dev");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// `Email` est établi dans la branche, mais `split` ne peut pas déduire le séparateur
// depuis cette contrainte : pour une entrée typée `string`, il garantit au moins un fragment.
const emailParts = DString.split(value, "@");
type _CheckEmailParts = DCommon.ExpectType<
	typeof emailParts,
	readonly string[] & DArray.MinElements<1>,
	"strict"
>;

if (DString.isEmail(value)) {
	type _CheckEmail = DCommon.ExpectType<typeof value, string & DString.Email, "strict">;
	const parts = DString.split(value, "@");
	type _CheckParts = DCommon.ExpectType<
		typeof parts,
		readonly string[] & DArray.MinElements<2>,
		"strict"
	>;
}

// Le même contrôle s’insère dans un pipe ; la longueur des fragments reste garantie.
const partCount = DCommon.pipe(
	value,
	DCommon.when(
		DString.isEmail,
		(email) => {
			type _CheckEmail = DCommon.ExpectType<typeof email, string & DString.Email, "strict">;

			return DString.split(email, "@");
		},
	),
);
type _CheckPartCount = DCommon.ExpectType<
	typeof partCount,
	string | (readonly string[] & DArray.MinElements<2>),
	"strict"
>;
