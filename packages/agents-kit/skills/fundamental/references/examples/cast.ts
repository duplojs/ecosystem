/**
 * @title Établir la compatibilité des contraintes.
 *
 * Convertir une garantie existante ou déclarer une valeur littérale.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import type * as DPath from "@duplojs/lang/path";

declare const belowTen: number & DNumber.LessThan<10>;
const belowTwentyFive: number & DNumber.LessThan<25> = DCommon.cast(belowTen);

const age: number & DNumber.GreaterThanOrEqual<18> = DCommon.cast(20);
const path: string & DPath.Path = DCommon.cast("resources/config.json");

// Une valeur incompatible ne peut pas acquérir la contrainte par cast.
// @ts-expect-error 10 ne respecte pas la borne minimale de 18.
const invalidAge: number & DNumber.GreaterThanOrEqual<18> = DCommon.cast(10);
