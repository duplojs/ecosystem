/**
 * @title Manipulation des valeurs contraintes.
 *
 * Exploitation des contraintes par les fonctions DuploJS pour simplifier la manipulation des valeurs.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DTuple from "@duplojs/lang/tuple";
import * as DString from "@duplojs/lang/string";
import * as DArray from "@duplojs/lang/array";

// Les primitives exploitent les garanties d’entrée pour préciser leur sortie.
// Une transformation conserve, adapte ou supprime les contraintes selon ce qui reste vrai.
declare const userEmail: string & DString.Email;

// Un email dans son format contenant obligatoirement un "@"
// donne forcément un tableau avec minimum 2 éléments.
const splitEmail = DString.split(userEmail, "@");
type _CheckSplitEmail = DCommon.ExpectType<typeof splitEmail, readonly string[] & DArray.MinElements<2>, "strict">;

// Le passage du tableau en tuple est fait en interprétant la contrainte
// DArray.MinElements<2>, ce qui garantit au moins deux éléments, sans imposer une longueur exacte.
const [first, second, ...maybeRest] = DTuple.from(splitEmail);
type _CheckFirst = DCommon.ExpectType<typeof first, string, "strict">;
type _CheckSecond = DCommon.ExpectType<typeof second, string, "strict">;
type _CheckMaybeRest = DCommon.ExpectType<typeof maybeRest, string[], "strict">;

// Les accès garantis par la cardinalité évitent le type string | undefined.
const firstElement = DArray.first(splitEmail);
type _CheckFirstElement = DCommon.ExpectType<typeof firstElement, string, "strict">;

const lastElement = DArray.last(splitEmail);
type _CheckLastElement = DCommon.ExpectType<typeof lastElement, string, "strict">;

const secondElement = DArray.at(splitEmail, 1);
type _CheckSecondElement = DCommon.ExpectType<typeof secondElement, string, "strict">;

const otherElement = DArray.at(splitEmail, 10);
type _CheckOtherElement = DCommon.ExpectType<typeof otherElement, string | undefined, "strict">;

// Le résultat porte une garantie de cardinalité ; les fragments ne sont plus typés Email.
// Privilégier les transformations immuables : une mutation pourrait invalider une garantie.
