/**
 * @title Currification et composition avec pipe.
 *
 * Configurer les opérations avant de recevoir la donnée et enchaîner ses transformations.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

// La forme curifiée reçoit les paramètres, puis la donnée transmise par pipe.
// Si la fonction retournée ne déclare pas ses propres génériques, ses types sont
// fixés dès l'appel de configuration, même si la surcharge extérieure est générique.
// Écrire alors l'appel curifié directement comme étape de pipe ou asyncPipe pour
// fournir le contexte d'inférence attendu. Passer à un pipe une variable contenant
// une fonction déjà préparée ne déplace pas sa configuration dans ce contexte.
// Ne pas forcer cette préparation avec des génériques explicites, annotations ou casts.
// Formater chaque pipe sur plusieurs lignes, un argument par ligne et la fermeture
// sur sa propre ligne, même avec seulement une donnée et une étape.
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
