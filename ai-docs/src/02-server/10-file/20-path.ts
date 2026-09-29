/**
 * @title Manipuler des chemins
 *
 * Le domaine `Path` fournit des contraintes et des fonctions dédiées
 * à la manipulation des chemins Unix.
 *
 * Un chemin reste représenté par une `string`, mais la contrainte `Path`
 * permet de l'identifier explicitement dans le typage et de garantir
 * qu'il respecte le format attendu.
 */

import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";

/**
 * Une valeur littérale peut être transformée directement en `Path`
 * lorsque sa validité peut être vérifiée par TypeScript.
 */
const resourcePath: string & DPath.Path = DCommon.cast(
	"resources/images/avatar.png",
);

/**
 * Pour une `string` dynamique, `create` permet de construire un `Path`
 * en validant sa valeur à l'exécution.
 */
declare const unsafePath: string;

const pathResult = DPath.create(unsafePath);

if (DEither.isRight(pathResult)) {
	const path = DEither.unwrapRight(pathResult);
	// path: string & DPath.Path
}

/**
 * Le domaine expose trois contraintes principales :
 *
 * - `Path` représente un chemin valide ;
 * - `Absolute` précise qu'un `Path` est absolu ;
 * - `Segment` représente un segment pouvant composer un chemin.
 *
 * Ces contraintes peuvent être combinées afin d'exprimer plus précisément
 * la nature d'une valeur.
 */
const absolutePath: string & DPath.Path & DPath.Absolute = DCommon.cast(
	"/resources/images",
);

const segment: string & DPath.Segment = DCommon.cast("assets");

/**
 * Plusieurs fonctions permettent de récupérer les différentes parties
 * d'un chemin sans manipuler directement sa `string`.
 */
const fileName = DPath.getBaseName(resourcePath);
// fileName: (string & DPath.Segment) | null

const extensionName = DPath.getExtensionName(resourcePath);
// extensionName: (string & DPath.Segment) | null

const parentFolderPath = DPath.getParentFolderPath(resourcePath);
// parentFolderPath: (string & DPath.Path) | null

/**
 * Les chemins peuvent être construits à partir de plusieurs `Path`
 * ou `Segment` sans avoir à manipuler directement leur représentation
 * sous forme de `string`.
 *
 * Les fonctions de résolution assemblent ces différentes parties
 * et résolvent leur relation pour produire un nouveau chemin valide.
 */
const imagesPath: string & DPath.Path & DPath.Absolute = DCommon.cast(
	"/resources/images",
);

// permet de résoudre à partir d'une origine
const resolvedPath = DPath.resolveFrom(
	imagesPath,
	[
		DCommon.infer("assets"),
		DCommon.infer("image1.png"),
	],
	{
		stayInOrigin: true,
	},
);

// résoud sans restriction
const relativePath = DPath.resolveRelative(
	[
		imagesPath,
		DCommon.infer("assets/logo"),
		DCommon.infer("logo1.png"),
	],
);
