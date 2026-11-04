/**
 * @title DPattern.matchWithNumberOtherwise
 *
 * Traiter certains nombres littéraux et recevoir les autres valeurs dans un fallback.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

declare const responseCode: 200 | 404 | 503;

const label = DPattern.matchWithNumberOtherwise(
	responseCode,
	{
		200: () => "success",
		404: () => "missing",
	},
	(code) => {
		type _CheckRemaining = DCommon.ExpectType<typeof code, 503, "strict">;
		return `retry ${code}`;
	},
);
// Les codes 200 et 404 ont leurs libellés ; 503 fournit « retry 503 » au fallback.
type _CheckLabel = DCommon.ExpectType<typeof label, string, "strict">;

// Appel curifié : seul 200 est traité ; le repli conserve 404 | 503.
const piped = DCommon.pipe(
	responseCode,
	DPattern.matchWithNumberOtherwise(
		{ 200: () => "success" },
		(code) => {
			type _CheckRemaining = DCommon.ExpectType<typeof code, 404 | 503, "strict">;
			return code;
		},
	),
);
// La sortie vaut "success" pour 200, sinon le code d’origine.
type _CheckPiped = DCommon.ExpectType<typeof piped, string | 404 | 503, "strict">;
