/**
 * @title Manipulation des valeurs contraintes.
 *
 * Exploitation des contraintes par les fonctions DuploJS pour simplifier la manipulation des valeurs.
 */
import * as DTuple from "@duplojs/lang/tuple";
import * as DString from "@duplojs/lang/string";
import * as DArray from "@duplojs/lang/array";

// Les primitives exploitent les garanties d’entrée pour préciser leur sortie.
// Une transformation conserve, adapte ou supprime les contraintes selon ce qui reste vrai.
declare const userEmail: string & DString.Email;

// Un email dans son format contenant obligatoirement un "@"
// donne forcément un tableau avec minimum 2 éléments.
// readonly string[] & DArray.MinElements<2>
const splitEmail = DString.split(userEmail, "@");

// Le passage du tableau en tuple est fait en interprétant la contrainte
// DArray.MinElements<2>, ce qui garantit au moins deux éléments, sans imposer une longueur exacte.
// readonly [string, string, ...string[]]
const [first, second, ...maybeRest] = DTuple.from(splitEmail);

// Les accès garantis par la cardinalité évitent le type string | undefined.
// string
const firstElement = DArray.first(splitEmail);

// string
const lastElement = DArray.last(splitEmail);

// string
const secondElement = DArray.at(splitEmail, 1);

// string | undefined
const otherElement = DArray.at(splitEmail, 10);

// Le résultat porte une garantie de cardinalité ; les fragments ne sont plus typés Email.
// Privilégier les transformations immuables : une mutation pourrait invalider une garantie.
