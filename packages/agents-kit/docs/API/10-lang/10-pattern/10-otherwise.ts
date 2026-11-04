/**
 * @title DPattern.otherwise
 *
 * Traiter la valeur non reconnue restante ou déballer un résultat déjà traité.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

type Input = {
	kind: "ready";
	value: number;
} | {
	kind: "pending";
	task: string;
};
declare const input: Input;
const ready = DPattern.when(input, DPattern.isMatch({ kind: "ready" }), (value) => value.value);
const output = DPattern.otherwise(ready, (remaining) => remaining.task);
// La branche déjà traitée fournit un nombre ; pending fournit son identifiant de tâche.
type _CheckOutput = DCommon.ExpectType<typeof output, number | string, "strict">;

// En forme curifiée, otherwise s’insère après les étapes qui ont marqué une branche traitée.
const piped = DCommon.pipe(
	input,
	DPattern.when(DPattern.isMatch({ kind: "ready" }), (value) => value.value),
	DPattern.otherwise((remaining) => remaining.task),
);
// La forme curifiée produit la même union de nombre et de texte.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | string, "strict">;
