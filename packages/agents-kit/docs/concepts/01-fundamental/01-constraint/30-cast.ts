/**
 * @title Compatibilité statique des contraintes.
 *
 * Cast par implication, valeurs littérales et inférence en contexte générique.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import type * as DString from "@duplojs/lang/string";

// cast restitue la valeur sans validation runtime : TypeScript doit prouver la compatibilité.
// Il convertit une garantie existante, ou exploite une valeur connue statiquement.
// Une donnée runtime sans preuve doit d’abord être vérifiée par un predicate.
declare function myFunction(name: string & DString.MinCharacters<10>): void;

declare const validName: string & DString.MinCharacters<15>;
// Au moins 15 caractères implique au moins 10 caractères.
myFunction(DCommon.cast(validName));

declare const invalidName: string & DString.MinCharacters<5>;
// Erreur de type car la contrainte `DString.MinCharacters<5>`
// n'induit pas `string & DString.MinCharacters<10>`
// @ts-expect-error constraint error
myFunction(DCommon.cast(invalidName));

// De même, une borne strictement inférieure à 10 implique une borne inférieure à 20.
declare const belowTen: number & DNumber.LessThan<10>;
const belowTwenty: number & DNumber.LessThan<20> = DCommon.cast(belowTen);

// Les valeurs littérales permettent aussi de calculer la compatibilité sans validation.
const declaredName: string & DString.MinCharacters<10> = DCommon.cast("thisIsASuperName");
const declaredAge: number & DNumber.GreaterThanOrEqual<18> = DCommon.cast(20);

declare function myFunctionWithGeneric<
	GenericName extends string & DString.MinCharacters<10>,
>(name: GenericName): void;

// Ici, le paramètre générique ne fournit pas à cast un type de retour assez précis.
// satisfies explicite la cible pour permettre le calcul de compatibilité.
myFunctionWithGeneric(
	DCommon.cast("thisIsASuperName") satisfies string & DString.MinCharacters<10>,
);

// @ts-expect-error cast ne peut pas inférer ici le type de retour attendu.
myFunctionWithGeneric(DCommon.cast("thisIsASuperName"));

declare function createUser<
	GenericUser extends {
		name: string & DString.MinCharacters<10>;
		age: number & DNumber.GreaterThanOrEqual<18>;
	},
>(name: GenericUser): GenericUser;

// infer calcule les contraintes attendues tout en conservant la valeur littérale.
// Il est adapté aux constantes connues statiquement et ne valide rien au runtime.
createUser({
	name: DCommon.infer("thisIsASuperName"),
	age: DCommon.infer(18),
});
// {
//     name: "thisIsASuperName" & DString.MinCharacters<10>;
//     age: 18 & DNumber.GreaterThanOrEqual<18>;
// }
