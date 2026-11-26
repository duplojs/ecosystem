/**
 * @title DContainer.createMap
 *
 * Créer un conteneur mutable associant des clés à des valeurs avec une API limitée.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DContainer from "@duplojs/lang/container";

const empty = DContainer.createMap();

type _CheckEmpty = DCommon.ExpectType<
	typeof empty,
	DContainer.Map<unknown, unknown>,
	"strict"
>;

// Les clés sont uniques : la dernière valeur remplace la précédente sans déplacer la clé.
const map = DContainer.createMap([["first", 1], ["second", 2], ["first", 3]]);

type _CheckMap = DCommon.ExpectType<
	typeof map,
	DContainer.Map<string, number>,
	"strict"
>;

// set modifie le conteneur et retourne void ; size est en lecture seule.
const written = map.set("third", 4);
// La taille vaut 3.
const size = map.size;

type _CheckWritten = DCommon.ExpectType<
	typeof written,
	void,
	"strict"
>;

// La valeur vaut 3 ; une clé absente retourne undefined.
const value = map.get("first");

type _CheckValue = DCommon.ExpectType<
	typeof value,
	number | undefined,
	"strict"
>;

// La suppression retourne true ; une nouvelle suppression retourne false.
const removed = map.delete("second");

type _CheckRemoved = DCommon.ExpectType<
	typeof removed,
	boolean,
	"strict"
>;

// Le conteneur est itérable dans l'ordre d'insertion : [["first", 3], ["third", 4]].
const entries = DArray.from(map);

type _CheckEntries = DCommon.ExpectType<
	typeof entries,
	readonly (readonly [string, number])[],
	"strict"
>;

// Tout itérable de paires peut initialiser une nouvelle map indépendante.
// La copie est superficielle : les clés et valeurs objets gardent leurs références.
const copy = DContainer.createMap(map);
// map.get("first") vaut toujours 3 après cette modification de la copie.
copy.set("first", 10);

type _CheckCopy = DCommon.ExpectType<
	typeof copy,
	DContainer.Map<string, number>,
	"strict"
>;

// Sans entrée initiale, les génériques définissent les types acceptés par les écritures.
const optionalValues = DContainer.createMap<string, number | undefined>();
optionalValues.set("present", undefined);
// La présence vaut true, malgré la valeur undefined.
const present = optionalValues.has("present");

type _CheckOptionalValues = DCommon.ExpectType<
	typeof optionalValues,
	DContainer.Map<string, number | undefined>,
	"strict"
>;

// La vue retire set et delete du contrat TypeScript, sans copier ni figer les données.
const view: DContainer.ReadonlyMap<string, number> = map;
map.set("first", 5);
// La vue donne accès à la valeur actuelle : 5.
const currentValue = view.get("first");

type _CheckCurrentValue = DCommon.ExpectType<
	typeof currentValue,
	number | undefined,
	"strict"
>;

// Le parcours reste lié au conteneur : il observe les ajouts et suppressions ultérieurs.
// Les méthodes clear, forEach, keys, values et entries ne sont pas exposées.
