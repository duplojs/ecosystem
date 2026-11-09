/**
 * @title DPrinter.renderLine
 *
 * Assembler récursivement des valeurs en séparant les éléments par une espace.
 */
import * as DPrinter from "@duplojs/lang/printer";
import type * as DCommon from "@duplojs/lang/common";

const line = DPrinter.renderLine(["Nom", [true, "Ada"], false]);

// La valeur obtenue est "Nom true Ada" ; false ne produit aucun texte.
type _CheckLine = DCommon.ExpectType<typeof line, string, "strict">;

const indentedLine = DPrinter.renderLine(["Nom", "Ada"], {
	indent: DPrinter.Indent.space2,
	indentLevel: 1,
});
// La valeur obtenue est "  Nom Ada" : l'indentation préfixe la ligne une seule fois.
type _CheckIndentedLine = DCommon.ExpectType<typeof indentedLine, string, "strict">;

// Un séparateur personnalisé permet notamment d'assembler des fragments sans espace.
const compact = DPrinter.renderLine(["Nom", ": ", "Ada"], {
	joinCharacter: "",
	indent: DPrinter.Indent.tab,
	indentLevel: 2,
});
// La valeur obtenue est "\t\tNom: Ada".
type _CheckCompact = DCommon.ExpectType<typeof compact, string, "strict">;

// Une chaîne multiligne conserve ses lignes suivantes sans indentation ajoutée.
const multiline = DPrinter.renderLine(["Nom\nAda"], {
	indent: DPrinter.Indent.space2,
	indentLevel: 1,
});
// La valeur obtenue est "  Nom\nAda".
type _CheckMultiline = DCommon.ExpectType<typeof multiline, string, "strict">;
