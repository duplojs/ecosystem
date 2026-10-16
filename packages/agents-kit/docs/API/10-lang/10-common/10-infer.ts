/**
 * @title DCommon.infer
 *
 * Inférer une contrainte à partir d’une valeur littérale dans une expression typée.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

const result: string & DString.MinCharacters<5> = DCommon.infer("value");

// La longueur du littéral fournit la contrainte minimale attendue.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	string & DString.MinCharacters<5>,
	"strict"
>;
