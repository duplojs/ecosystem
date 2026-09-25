/**
 * @title Manipulation des variable avec des `Constraint`.
 *
 * Les contraintes impliquent des vérités sur la données au run time.
 * Les vérités sont exploitées par les fonctions de la librairie.
 * Cela permet de compenser les problèmes de typage faibles de TypeScript de base.
 * Toute manipulation implique également perte/changement de contrainte pour la valeur obtenue.
 */
import * as DTuple from "@duplojs/lang/tuple";
import * as DString from "@duplojs/lang/string";
import * as DArray from "@duplojs/lang/array";

declare const userEmail: string & DString.Email;

// Un email dans son format contenant obligatoirement un "@"
// donne forcément un tableau avec minimum 2 éléments.
// string[] & DArray.MinElements<2>
const spitedEmail = DString.split(userEmail, "@");

// Le passage du tableau en tuple est fait en interprétant la contrainte
// DArray.MinElements<2>, ce qui permet de déduire que le tableau a forcément deux éléments.
// [string, string, ...string[]]
const [first, second, ...maybeRest] = DTuple.from(spitedEmail);

// string
const firstElement = DArray.first(spitedEmail);

// string
const lastElement = DArray.last(spitedEmail);

// string
const secondElement = DArray.at(spitedEmail, 1);

// string | undefined
const otherElement = DArray.at(spitedEmail, 10);
