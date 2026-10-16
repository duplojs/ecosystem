/**
 * @title DArray.last
 *
 * Lire le dernier élément d’un tableau en conservant les garanties de son type.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const values = ["first", "last"];

// La valeur obtenue est "last" ; un tableau sans garantie de cardinalité peut être vide.
const result = DArray.last(values);

type _CheckResult = DCommon.ExpectType<typeof result, string | undefined, "strict">;

// Une contrainte de cardinalité minimale garantit aussi l’existence du dernier élément.
declare const constrained: readonly string[] & DArray.MinElements<1>;
const guaranteed = DArray.last(constrained);

// La valeur obtenue est une string sans undefined.
type _CheckConstrained = DCommon.ExpectType<typeof guaranteed, string, "strict">;
