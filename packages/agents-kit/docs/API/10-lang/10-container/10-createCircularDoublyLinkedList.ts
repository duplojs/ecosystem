/**
 * @title DContainer.createCircularDoublyLinkedList
 *
 * Créer une liste circulaire mutable avec ajout, lecture et retrait aux deux extrémités.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DContainer from "@duplojs/lang/container";

// Une liste vide a une longueur de 0.
// first, last, pop et shift retournent undefined lorsqu'elle est vide.
const pending = DContainer.createCircularDoublyLinkedList<number>();
const missing = pending.shift();

type _CheckMissing = DCommon.ExpectType<
	typeof missing,
	number | undefined,
	"strict"
>;

// L'itérable initial est parcouru une fois, en conservant l'ordre et les doublons.
const list = DContainer.createCircularDoublyLinkedList([1, 2, 2]);

type _CheckList = DCommon.ExpectType<
	typeof list,
	DContainer.CircularDoublyLinkedList<number>,
	"strict"
>;

// add insère à la fin ; prepend insère au début. Ces opérations modifient la liste.
list.add(3);
list.prepend(0);

// length est en lecture seule dans l'interface publique.
// La longueur vaut maintenant 5 et le parcours produit [0, 1, 2, 2, 3].
// Sans mutation pendant le parcours, l'itérateur fait un seul tour et émet les valeurs.
const values = DArray.from(list);

type _CheckValues = DCommon.ExpectType<
	typeof values,
	readonly number[],
	"strict"
>;

// first et last lisent les valeurs aux extrémités sans les retirer : 0 et 3.
const first = list.first();
const last = list.last();

type _CheckFirst = DCommon.ExpectType<
	typeof first,
	number | undefined,
	"strict"
>;

type _CheckLast = DCommon.ExpectType<
	typeof last,
	number | undefined,
	"strict"
>;

// pop retire la dernière valeur (3) ; shift retire la première (0).
// La liste contient ensuite [1, 2, 2] et sa longueur vaut 3.
const popped = list.pop();
const shifted = list.shift();

type _CheckPopped = DCommon.ExpectType<
	typeof popped,
	number | undefined,
	"strict"
>;

type _CheckShifted = DCommon.ExpectType<
	typeof shifted,
	number | undefined,
	"strict"
>;
