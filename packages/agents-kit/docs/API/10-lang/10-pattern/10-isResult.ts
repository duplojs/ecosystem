/**
 * @title DPattern.isResult
 *
 * Reconnaître au runtime une valeur enveloppée par DPattern.result.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

declare const candidate: DPattern.PatternResult<string> | string;

if (DPattern.isResult(candidate)) {
	// Le garde a isolé le wrapper ; exhaustive en extrait la chaîne.
	const unwrapped = DPattern.exhaustive(candidate);
	type _CheckUnwrapped = DCommon.ExpectType<typeof unwrapped, string, "strict">;
}

// Dans un pipe, isResult transmet le wrapper reconnu à exhaustive et laisse passer la chaîne déjà déballée.
const unwrapped = DCommon.pipe(
	candidate,
	DCommon.when(DPattern.isResult, DPattern.exhaustive),
);
type _CheckPipe = DCommon.ExpectType<typeof unwrapped, string, "strict">;
