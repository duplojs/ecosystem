/**
 * @title DCommon.createConstraintFactory
 *
 * Créer une fonction qui applique un type contraint lorsque l'entrée le prouve statiquement.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

// La fabrique applique une contrainte vérifiée statiquement, sans validation runtime.
type ShortName = string & DString.MinCharacters<3> & DString.MaxCharacters<8>;
const declareShortName = DCommon.createConstraintFactory<ShortName>();

const name = declareShortName("Alice");
// La valeur "Alice" et les contraintes sont conservées.
type _CheckName = DCommon.ExpectType<
	typeof name,
	"Alice" & ShortName,
	"strict"
>;

// Une preuve plus restrictive satisfait également le contrat.
declare const provenName: string & DString.MinCharacters<4> & DString.MaxCharacters<6>;
const reused = declareShortName(provenName);
type _CheckReused = DCommon.ExpectType<
	typeof reused,
	string & DString.MinCharacters<4> & DString.MaxCharacters<6> & ShortName,
	"strict"
>;

// @ts-expect-error Le littéral ne satisfait pas la longueur minimale.
declareShortName("Al");
