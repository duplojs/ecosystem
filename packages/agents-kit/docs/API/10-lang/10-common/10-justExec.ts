/**
 * @title DCommon.justExec
 *
 * Encapsuler une logique impérative locale et affecter directement son résultat.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: number;

const result = DCommon.justExec(() => {
	if (input > 10) {
		return "large" as const;
	}

	if (input > 0) {
		return "positive" as const;
	}

	return "non-positive" as const;
});

// Le bloc est exécuté immédiatement : son résultat est directement affecté à `result`.
// Cela évite une variable mutable initialisée à vide puis réassignée dans chaque branche.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	"large" | "positive" | "non-positive",
	"strict"
>;
