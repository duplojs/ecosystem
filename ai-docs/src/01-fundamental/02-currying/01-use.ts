/**
 * @title Utilisation
 *
 * Dans DuploJS, les fonctions curifiées sont principalement conçues pour
 * composer des transformations dans des `pipe`.
 *
 * Dès qu'une même donnée doit subir plusieurs transformations successives,
 * il faut privilégier un `pipe`.
 *
 * Cela permet d'ajouter, retirer ou réordonner facilement des transformations
 * sans modifier la structure générale du traitement.
 *
 * Pour une opération unique qui reçoit directement la donnée, utiliser
 * directement la fonction est suffisant.
 *
 * Lorsqu'un traitement est susceptible d'accueillir d'autres transformations,
 * il est également pertinent de commencer directement avec un `pipe`.
 *
 * Lorsqu'un `pipe` est utilisé, il faut privilégier les fonctions curifiées
 * fournies par l'écosystème plutôt que réimplémenter les transformations
 * avec des callbacks ou des API natives.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

// Une seule transformation ne nécessite pas forcément de `pipe`.
const trimmedName = DString.trim(" John ");

// Dès qu'une donnée subit plusieurs transformations successives,
// il faut privilégier un `pipe`.
//
// readonly (Lowercase<string> & DString.MinCharacters<1>)[] & DArray.MaxElements<3>
const normalizedTags = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	DString.split(","),
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
);

// Les fonctions curifiées permettent de configurer une transformation
// avant que la donnée ne leur soit fournie par le `pipe`.
//
// `DString.split(",")` configure le séparateur.
// La chaîne à découper sera fournie ensuite par `pipe`.
//
// `DArray.map(DString.trim)` configure également une transformation
// qui recevra ensuite le tableau provenant de l'étape précédente.

// `innerPipe` permet d'enchaîner plusieurs transformations lorsqu'une
// fonction de transformation est elle-même attendue.
//
// readonly (Lowercase<string> & DString.NotEmpty)[] & DArray.MaxElements<3>
const normalizedTagsWithInnerPipe = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	DString.split(","),
	DArray.map(
		DCommon.innerPipe(
			DString.trim,
			DString.toLowerCase,
		),
	),
	DArray.filter(DString.isNotEmpty),
);

// `innerPipe` évite de créer une callback intermédiaire uniquement
// pour enchaîner plusieurs transformations.
//
// readonly (number & Positive)[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>
const tagLengths = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	DString.split(","),
	DArray.map(
		DCommon.innerPipe(
			DString.trim,
			DString.length,
		),
	),
);

// `asyncPipe` applique le même principe lorsqu'une ou plusieurs étapes
// du traitement sont asynchrones.
//
// Promise<readonly Lowercase<string>[] & DArray.LengthEqual<2> & DArray.MinElements<2> & DArray.MaxElements<2>>
const asyncTags = DCommon.asyncPipe(
	Promise.resolve(" TypeScript, DuploJS " as const),
	DString.split(","),
	DArray.map(DString.trim),
	(tags) => Promise.resolve(tags),
	DArray.map(DString.toLowerCase),
);

// `asyncInnerPipe` permet de composer plusieurs transformations synchrones
// ou asynchrones lorsqu'une callback asynchrone est attendue.
//
// Promise<readonly Promise<Lowercase<string>>[] & DArray.LengthEqual<2>>
const values = DCommon.asyncPipe(
	[" TypeScript ", " DuploJS "] as const,
	DArray.map(
		DCommon.asyncInnerPipe(
			(value) => Promise.resolve(value),
			DString.trim,
			DString.toLowerCase,
		),
	),
);
