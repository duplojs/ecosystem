/**
 * @title Currification et composition avec pipe.
 *
 * Configurer les opérations avant de recevoir la donnée et enchaîner ses transformations.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

// La forme curifiée reçoit les paramètres, puis la donnée transmise par pipe.
// Privilégier pipe dès qu’une donnée subit plusieurs transformations,
// ou si le traitement est susceptible d’en accueillir d’autres.
// Utiliser en priorité les fonctions fournies par l’écosystème.
const normalizedTags = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	// Configure le séparateur ; pipe fournit ensuite la chaîne.
	DString.split(","),
	// Configure la transformation ; pipe fournit le tableau.
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
);
// Résultat : ["typescript", "duplojs", "functional"].
// Chaque étape reçoit la sortie précédente ; les types suivent ces transformations.
// On peut ajouter, retirer ou réordonner les étapes sans restructurer le traitement.
