/**
 * @title DPrinter.colorizedBold
 *
 * Appliquer une couleur ANSI et le style gras à une chaîne.
 */
import * as DPrinter from "@duplojs/lang/printer";
import * as DCommon from "@duplojs/lang/common";

// Appel direct : la valeur obtenue est "\x1B[1m\x1B[33mÀ vérifier\x1B[0m\x1B[0m".
const warning = DPrinter.colorizedBold("À vérifier", "yellow");
type _CheckWarning = DCommon.ExpectType<typeof warning, string, "strict">;

// Appel curifié dans un pipe : la valeur obtenue est "\x1B[1m\x1B[36mRésumé\x1B[0m\x1B[0m".
const heading = DCommon.pipe(
	"Résumé",
	DPrinter.colorizedBold("cyan"),
);
type _CheckHeading = DCommon.ExpectType<typeof heading, string, "strict">;
