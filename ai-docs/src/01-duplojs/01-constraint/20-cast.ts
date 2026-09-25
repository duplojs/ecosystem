/**
 * @title Cast d'une contrainte
 *
 * Le cast permet de considérer une donnée comme respectant une contrainte sans
 * exécuter sa validation.
 *
 * Le typage calcule la compatibilité et autorisera son utilisation uniquement
 * si une contrainte en induit une autre. Exemple, si j'attends un nombre avec
 * `DNumber.LessThan<20>` alors un contrainte `DNumber.LessThan<10>` est correct.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import type * as DString from "@duplojs/lang/string";

declare function myFunction(name: string & DString.MinCharacters<10>): void;

declare const validName: string & DString.MinCharacters<15>;
myFunction(DCommon.cast(validName));

declare const invalidName: string & DString.MinCharacters<5>;
// Erreur de type car la contrainte `DString.MinCharacters<5>`
// n'induit pas `string & DString.MinCharacters<10>`
// @ts-expect-error constraint error
myFunction(DCommon.cast(invalidName));

//Le caste fonctionne aussi avec des valeurs littérales.
const declaredName: string & DString.MinCharacters<10> = DCommon.cast("thisIsASuperName");
const declaredAge: number & DNumber.GreaterThanOrEqual<18> = DCommon.cast(20);

declare function myFunctionWithGeneric<
	GenericName extends string & DString.MinCharacters<10>,
>(name: GenericName): void;

// Quand la valeur avec une contrainte est directement un générique, on est obligé de passer par un
// satisfy et de réapposer la contrainte pour que cast puisse inférer sa valeur de retour et
// appliquer une comparaison.
myFunctionWithGeneric(
	DCommon.cast("thisIsASuperName") satisfies string & DString.MinCharacters<10>,
);

// @ts-expect-error N'arrivent pas à inférer le retour.
myFunctionWithGeneric(DCommon.cast("thisIsASuperName"));

declare function createUser<
	GenericUser extends {
		name: string & DString.MinCharacters<10>;
		age: number & DNumber.GreaterThanOrEqual<18>;
	},
>(name: GenericUser): GenericUser;

// Dans le cadre où on souhaite inférer la valeur littérale, mais également vérifier
// une contrainte, alors dans ce cas là, il est possible d'utiliser la fonction infer.
// Elle calcule le retour tout en conservant la valeur littérale envoyée. La fonction
// est spécialisée pour les déclarations de valeurs constante prévues en avance.
createUser({
	name: DCommon.infer("thisIsASuperName"),
	age: DCommon.infer(18),
});
// {
//     name: "thisIsASuperName" & DString.MinCharacters<10>;
//     age: 18 & DNumber.GreaterThanOrEqual<18>;
// }
