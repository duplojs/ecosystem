/**
 * @title DPattern.exhaustive
 *
 * Terminer un traitement exhaustif en extrayant les valeurs des PatternResult.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DNumber from "@duplojs/lang/number";

// exhaustive n’accepte que des PatternResult : tous les cas doivent déjà être traités.
declare const input: string | number;
const value = DCommon.pipe(
	input,
	DPattern.when(DCommon.isType("string"), DString.toUpperCase),
	DPattern.when(DCommon.isType("number"), (number) => DNumber.sum([number, 1])),
	DPattern.exhaustive,
);
// Une chaîne donne sa version majuscule ; un nombre est augmenté de 1.
type _CheckValue = DCommon.ExpectType<typeof value, Uppercase<string> | number, "strict">;

// Appel direct : un PatternResult est déballé sans autre transformation.
const handled = DPattern.result({
	status: "saved",
	id: 8,
});
const direct = DPattern.exhaustive(handled);
// La valeur obtenue est { status: "saved", id: 8 }.
type _CheckDirect = DCommon.ExpectType<typeof direct, {
	readonly status: "saved";
	readonly id: 8;
}, "strict">;

// Pour une sélection partielle, terminer par otherwise plutôt que forcer le type.
const partial = DPattern.when(input, DCommon.isType("string"), DString.toUpperCase);
// @ts-expect-error La variante number est encore non traitée.
DPattern.exhaustive(partial);
