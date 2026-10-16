/**
 * @title DArray.at
 *
 * Lire l’élément situé à un index en reflétant dans le type la possibilité d’une absence.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const colors = ["red", "green", "blue"] as const;

// Appel classique : l’index couvert renvoie l’union des éléments du tableau.
const color = DArray.at(colors, 1);

// La valeur obtenue est « green » au runtime, mais le type conserve les trois valeurs possibles.
type _CheckColor = DCommon.ExpectType<
	typeof color,
	"red" | "green" | "blue",
	"strict"
>;

// Appel curifié : l’index est fixé dans l’étape du pipe.
const firstColor = DCommon.pipe(
	colors,
	DArray.at(0),
);

// La valeur obtenue est « red » au runtime.
type _CheckFirstColor = DCommon.ExpectType<
	typeof firstColor,
	"red" | "green" | "blue",
	"strict"
>;

// Un index littéral hors limites est identifié statiquement.
const missingColor = DArray.at(colors, 3);

// La valeur obtenue est undefined au runtime.
type _CheckMissingColor = DCommon.ExpectType<
	typeof missingColor,
	undefined,
	"strict"
>;

// Avec un index connu seulement au runtime, l’élément peut être absent.
declare const index: number;
const maybeColor = DArray.at(colors, index);

// La sortie contient un élément si l’index est valide, sinon undefined.
type _CheckMaybeColor = DCommon.ExpectType<
	typeof maybeColor,
	"red" | "green" | "blue" | undefined,
	"strict"
>;

// Une contrainte de cardinalité permet de supprimer undefined pour les indices garantis.
declare const names: readonly string[] & DArray.MinElements<2>;
const guaranteedName = DArray.at(names, 1);
const maybeName = DArray.at(names, 2);

// Le deuxième élément est garanti ; le troisième ne l’est pas.
type _CheckConstrainedNames = DCommon.ExpectType<
	[typeof guaranteedName, typeof maybeName],
	[string, string | undefined],
	"strict"
>;
