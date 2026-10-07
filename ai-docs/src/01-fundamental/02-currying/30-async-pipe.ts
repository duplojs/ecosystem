/**
 * @title Composition de traitements asynchrones.
 *
 * Enchaîner des étapes synchrones et asynchrones dans un pipe ou une callback.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

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
// map produit ici un tableau de promesses ; asyncPipe attend chaque étape, pas chaque élément.
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

// Pour récupérer les valeurs résolues, ajouter une étape qui attend toutes les promesses.
const resolvedValues = DCommon.asyncPipe(
	values,
	DCommon.promiseAll,
);
