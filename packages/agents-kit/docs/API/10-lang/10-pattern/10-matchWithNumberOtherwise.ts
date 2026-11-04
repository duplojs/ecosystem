/**
 * @title DPattern.matchWithNumberOtherwise
 *
 * Traiter certains nombres littéraux et recevoir les autres valeurs dans un fallback.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";

declare const responseCode: 200 | 404 | 503;

const label = DPattern.matchWithNumberOtherwise(
	responseCode,
	{
		200: () => "success",
		404: () => "missing",
	},
	(code) => {
		const remaining: 503 = code;
		return `retry ${remaining}`;
	},
);
// Les codes 200 et 404 ont leurs libellés ; 503 fournit « retry 503 » au fallback.
type _CheckLabel = DCommon.ExpectType<typeof label, string, "strict">;
