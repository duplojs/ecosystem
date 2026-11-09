/**
 * @title DPrinter.renderParagraph
 *
 * Assembler récursivement des valeurs en séparant les éléments par un saut de ligne.
 */
import * as DPrinter from "@duplojs/lang/printer";
import * as DCommon from "@duplojs/lang/common";

const paragraph = DPrinter.renderParagraph([
	"Première ligne",
	["Deuxième ligne", false],
	"Troisième ligne",
]);

// La valeur obtenue est "Première ligne\nDeuxième ligne\nTroisième ligne".
type _CheckParagraph = DCommon.ExpectType<typeof paragraph, string, "strict">;

// Le rendu direct permet de choisir CRLF et une indentation par ligne.
const windowsParagraph = DPrinter.renderParagraph(["Première", "Deuxième"], {
	back: DPrinter.Back.CRLF,
	indent: DPrinter.Indent.tab,
	indentLevel: 1,
});
// La valeur obtenue est "\tPremière\r\n\tDeuxième".
type _CheckWindowsParagraph = DCommon.ExpectType<typeof windowsParagraph, string, "strict">;

// La forme curifiée configure le rendu avant de recevoir les valeurs du pipe.
const spacedParagraph = DCommon.pipe(
	["Première", ["Deuxième", false]],
	DPrinter.renderParagraph({
		back: DPrinter.Back.LF,
		indent: DPrinter.Indent.space2,
		indentLevel: 1,
	}),
);
// La valeur obtenue est "  Première\n  Deuxième".
type _CheckSpacedParagraph = DCommon.ExpectType<typeof spacedParagraph, string, "strict">;
