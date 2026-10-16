/**
 * @title DArray.first
 *
 * Lire le premier élément d’un tableau en conservant les garanties de son type.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const values = ["first", "second"];

// La valeur obtenue est "first" ; un tableau sans garantie de cardinalité peut être vide.
const result = DArray.first(values);

type _CheckResult = DCommon.ExpectType<typeof result, string | undefined, "strict">;

// Une contrainte de cardinalité minimale garantit l’existence du premier élément.
declare const constrained: readonly string[] & DArray.MinElements<1>;
const guaranteed = DArray.first(constrained);

// La valeur obtenue est une string sans undefined.
type _CheckConstrained = DCommon.ExpectType<typeof guaranteed, string, "strict">;
