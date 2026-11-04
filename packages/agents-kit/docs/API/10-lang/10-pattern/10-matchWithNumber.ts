/**
 * @title DPattern.matchWithNumber
 *
 * Associer chaque nombre littéral possible à un callback spécialisé pour cette valeur.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";

declare const responseCode: 200 | 404;

const result = DPattern.matchWithNumber(responseCode, {
	200: (code) => {
		const exact: 200 = code;
		return `success ${exact}`;
	},
	404: (code) => {
		const exact: 404 = code;
		return `missing ${exact}`;
	},
});
// Le handler sélectionné retourne le libellé de réussite ou d’absence.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
