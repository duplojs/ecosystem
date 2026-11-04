/**
 * @title DPattern.matchWithNumber
 *
 * Associer chaque nombre littéral possible à un callback spécialisé pour cette valeur.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

declare const responseCode: 200 | 404;

const result = DPattern.matchWithNumber(responseCode, {
	200: (code) => {
		type _CheckValue = DCommon.ExpectType<typeof code, 200, "strict">;
		return `success ${code}`;
	},
	404: (code) => {
		type _CheckValue = DCommon.ExpectType<typeof code, 404, "strict">;
		return `missing ${code}`;
	},
});
// Le handler sélectionné retourne le libellé de réussite ou d’absence.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

// Appel curifié : toutes les valeurs de l’union sont couvertes dans le pipe.
const piped = DCommon.pipe(
	responseCode,
	DPattern.matchWithNumber({
		200: () => true,
		404: () => false,
	}),
);
// La sortie vaut true pour 200, false pour 404.
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
