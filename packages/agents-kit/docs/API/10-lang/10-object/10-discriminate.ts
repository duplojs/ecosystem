/**
 * @title DObject.discriminate
 *
 * Tester une propriété avec un predicate et affiner l’objet par intersection.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

// Le predicate reçoit la valeur de la propriété. S’il affine cette valeur,
// l’objet conserve son type initial en intersection avec la propriété affinée.
declare const input: {
	value: string | number;
	id: number;
};

// Appel classique : affiner une propriété, même sans union d’objets.
if (DObject.discriminate(input, "value", DCommon.isType("string"))) {
	type _CheckInput = DCommon.ExpectType<
		typeof input,
		{
			value: string | number;
			id: number;
		} & { value: string },
		"strict"
	>;
	const value = input.value;

	type _CheckValue = DCommon.ExpectType<typeof value, string, "strict">;
}

// Appel curifié : lire la chaîne si elle est présente, sinon conserver l’objet.
const result = DCommon.pipe(
	input,
	DCommon.when(
		DObject.discriminate("value", DCommon.isType("string")),
		(value) => {
			type _CheckValue = DCommon.ExpectType<
				typeof value,
				{
					value: string | number;
					id: number;
				} & { value: string },
				"strict"
			>;

			return value.value;
		},
	),
);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	string | {
		value: string | number;
		id: number;
	},
	"strict"
>;

// Les contraintes établies par le predicate sont portées par la propriété.
declare const person: {
	age: number;
	name: string;
};

if (DObject.discriminate(person, "age", DNumber.greaterThan(18))) {
	type _CheckPerson = DCommon.ExpectType<
		typeof person,
		{
			age: number;
			name: string;
		} & { age: number & DNumber.GreaterThan<18> },
		"strict"
	>;
}

// Composer les predicates pour une propriété imbriquée.
// DCommon.equal permet de conserver une vérification d’égalité.
declare const account: {
	profile: { role: string };
	id: number;
};

if (DObject.discriminate(account, "profile", DObject.discriminate("role", DCommon.equal("admin")))) {
	type _CheckAccount = DCommon.ExpectType<
		typeof account,
		{
			profile: { role: string };
			id: number;
		} & { profile: { role: string } & { role: "admin" } },
		"strict"
	>;
}

// Un predicate booléen reste accepté, sans affiner l’objet.
declare const threshold: number;

const isAboveThreshold = DObject.discriminate(person, "age", DNumber.greaterThan(threshold));

// true uniquement si l’âge dépasse le seuil fourni à l’exécution.
type _CheckIsAboveThreshold = DCommon.ExpectType<typeof isAboveThreshold, boolean, "strict">;
