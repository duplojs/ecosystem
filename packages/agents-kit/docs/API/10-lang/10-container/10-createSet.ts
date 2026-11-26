/**
 * @title DContainer.createSet
 *
 * Créer un conteneur mutable de valeurs uniques avec une API limitée.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DContainer from "@duplojs/lang/container";

const empty = DContainer.createSet();

type _CheckEmpty = DCommon.ExpectType<
	typeof empty,
	DContainer.Set<unknown>,
	"strict"
>;

// Les doublons sont ignorés en conservant l'ordre de première insertion.
const set = DContainer.createSet(["first", "second", "first"]);

type _CheckSet = DCommon.ExpectType<
	typeof set,
	DContainer.Set<string>,
	"strict"
>;

// add modifie le conteneur et retourne void ; size est en lecture seule.
const added = set.add("third");
set.add("first");
// La taille vaut 3.
const size = set.size;

type _CheckAdded = DCommon.ExpectType<
	typeof added,
	void,
	"strict"
>;

// La présence vaut true ; une valeur absente retourne false.
const present = set.has("first");

type _CheckPresent = DCommon.ExpectType<
	typeof present,
	boolean,
	"strict"
>;

// La suppression retourne true ; une nouvelle suppression retourne false.
const removed = set.delete("first");
// Une valeur supprimée puis réinsérée prend la dernière position.
set.add("first");

type _CheckRemoved = DCommon.ExpectType<
	typeof removed,
	boolean,
	"strict"
>;

// Le conteneur est itérable dans l'ordre d'insertion : ["second", "third", "first"].
const values = DArray.from(set);

type _CheckValues = DCommon.ExpectType<
	typeof values,
	readonly string[],
	"strict"
>;

// Tout itérable peut initialiser un nouveau set indépendant.
// La copie est superficielle : les valeurs objets gardent leurs références.
const copy = DContainer.createSet(set);
// set.has("first") vaut toujours true après cette suppression dans la copie.
copy.delete("first");

type _CheckCopy = DCommon.ExpectType<
	typeof copy,
	DContainer.Set<string>,
	"strict"
>;

// Sans valeur initiale, le générique définit les valeurs acceptées par les écritures.
const optionalValues = DContainer.createSet<number | undefined>();
optionalValues.add(undefined);
// undefined est une entrée présente : has retourne true.
const containsUndefined = optionalValues.has(undefined);

type _CheckOptionalValues = DCommon.ExpectType<
	typeof optionalValues,
	DContainer.Set<number | undefined>,
	"strict"
>;

// La vue retire add et delete du contrat TypeScript, sans copier ni figer les données.
const view: DContainer.ReadonlySet<string> = set;
set.add("fourth");
// La vue donne accès aux valeurs actuelles : ["second", "third", "first", "fourth"].
const currentValues = DArray.from(view);

type _CheckCurrentValues = DCommon.ExpectType<
	typeof currentValues,
	readonly string[],
	"strict"
>;

// Le parcours reste lié au conteneur : il observe les ajouts et suppressions ultérieurs.
// Les méthodes clear, forEach, keys, values et entries ne sont pas exposées.
