/**
 * @title DInvocation.workflowIterateGenerator
 *
 * Traiter chaque élément d'une collection validée avec une concurrence choisie à la consommation.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DObject from "@duplojs/lang/object";
import type * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

type ValidatedCollection = { id: string } & DInvocation.Evidence<"update-allowed">;
interface Entry {
	id: string;
	enabled: boolean;
}

declare function validateCollection(id: string): Promise<
	| DEither.Success<ValidatedCollection>
	| DEither.Left<"update-forbidden", string>
>;
declare function getEntries(collection: ValidatedCollection): AsyncGenerator<Entry>;
declare function saveEntry(entry: Entry): Promise<DEither.Ok | DEither.Left<"save-failed", string>>;

// createWorkflow expose workflowIterateGenerator sous le nom iterate.
// La validation porte sur la possibilité de traiter la collection entière.
const enableCollection = DInvocation.createWorkflow(({ resolve, iterate, commit }) => function *(id: string) {
	const collection: ValidatedCollection = yield *resolve("validated-collection", id);
	yield *iterate("entries", collection)(function *(entry: Entry) {
		yield *commit("entry", DObject.override(entry, { enabled: true }));
	});
	return collection.id;
});

// La forme fonction seule consomme les éléments un par un.
const sequential = DInvocation.consumeWorkflow(enableCollection("42"), {
	"resolve/validated-collection": validateCollection,
	"iterate/entries": getEntries,
	"commit/entry": saveEntry,
});
type _CheckSequential = DCommon.ExpectType<
	typeof sequential,
	Promise<
		| string
		| DEither.Left<"update-forbidden", string>
		| DEither.Left<"save-failed", string>
	>,
	"strict"
>;

// La forme objet demande des lots d'au plus cinq workflows exécutés en parallèle.
const concurrent = DInvocation.consumeWorkflow(enableCollection("42"), {
	"resolve/validated-collection": validateCollection,
	"iterate/entries": {
		getIterator: getEntries,
		concurrency: 5,
	},
	"commit/entry": saveEntry,
});
type _CheckConcurrent = DCommon.ExpectType<
	typeof concurrent,
	Promise<
		| string
		| DEither.Left<"update-forbidden", string>
		| DEither.Left<"save-failed", string>
	>,
	"strict"
>;
// Le consommateur attend tout le lot avant de demander le suivant. Cela permet
// les mises à jour massives sans réunir toute la collection en mémoire.
// Les effets imbriqués utilisent la même table d'implémentations.

// Le getter accepte aussi un iterable synchrone, directement ou dans un Right,
// et peut le retourner dans une promesse. Un Left d'acquisition arrête le parcours.
declare function findEntries(collection: ValidatedCollection): Promise<
	| DEither.Right<"entries", Iterable<Entry>>
	| DEither.Left<"source-unavailable", undefined>
>;
// Cette variante reçoit directement la preuve établie en amont.
declare const validatedCollection: ValidatedCollection;
const processEntries = DInvocation.createWorkflow(({ iterate, commit }) => function *(collection: ValidatedCollection) {
	const iterated = yield *iterate("entries", collection)(function *(entry: Entry) {
		yield *commit("entry", entry);
	});
	type _CheckIterated = DCommon.ExpectType<
		typeof iterated,
		void,
		"strict"
	>;
	return collection.id;
});
const wrappedSource = DInvocation.consumeWorkflow(processEntries(validatedCollection), {
	"iterate/entries": findEntries,
	"commit/entry": saveEntry,
});
type _CheckWrappedSource = DCommon.ExpectType<
	typeof wrappedSource,
	Promise<
		| string
		| DEither.Left<"source-unavailable", undefined>
		| DEither.Left<"save-failed", string>
	>,
	"strict"
>;
// iterate retourne void : les résultats de réussite des éléments sont ignorés.
// Un Left d'un workflow enfant, y compris son return, interrompt l'itération
// après la fin du lot courant ; aucun lot suivant n'est commencé.
// Une exception peut rejeter la consommation avant la fin des autres enfants
// déjà lancés. Ceux-ci peuvent continuer ; aucune annulation n'est implicite.
