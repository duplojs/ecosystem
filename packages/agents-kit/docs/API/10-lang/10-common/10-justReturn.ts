/**
 * @title DCommon.justReturn
 *
 * Fournir une valeur déjà calculée à une étape de pipe sans écrire de callback.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: "ready" | "pending";

const result = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.equal("ready"),
		DCommon.justReturn("done"),
	),
);

// `justReturn` remplace une callback comme `() => "done"` dans le `when` curifié.
type _CheckResult = DCommon.ExpectType<typeof result, "done" | "pending", "strict">;
