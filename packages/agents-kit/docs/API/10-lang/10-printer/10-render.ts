/**
 * @title DPrinter.render
 *
 * Assembler récursivement des valeurs rendables avec un séparateur choisi.
 */
import * as DPrinter from "@duplojs/lang/printer";
import * as DCommon from "@duplojs/lang/common";

// Appel direct : les tableaux imbriqués sont aplatis et true est rendu.
// false, null et undefined sont ignorés.
const summary = DPrinter.render(
	["Éléments", [true, "validés"], false, null, undefined],
	" ",
);
// La valeur obtenue est "Éléments true validés".
type _CheckSummary = DCommon.ExpectType<typeof summary, string, "strict">;

// Appel curifié dans un pipe : le séparateur est configuré avant de recevoir les valeurs.
const compact = DCommon.pipe(
	["nom", ["type", false], "statut"],
	DPrinter.render(" · "),
);
// La valeur obtenue est "nom · type · statut".
type _CheckCompact = DCommon.ExpectType<typeof compact, string, "strict">;

// Une chaîne vide est conservée, contrairement à false, null et undefined.
const emptyField = DPrinter.render(["nom", "", "statut"], "|");
// La valeur obtenue est "nom||statut" ; un tableau sans élément rendable donnerait "".
type _CheckEmptyField = DCommon.ExpectType<typeof emptyField, string, "strict">;
