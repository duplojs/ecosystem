/**
 * @title DCommon.toJSON
 *
 * Transformer récursivement les valeurs DuploJS vers leur représentation JSON.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.toJSON({
	toJSON() {
		return "json" as const;
	},
});

// La méthode toJSON est appelée sur la valeur fournie.
type _CheckResult = DCommon.ExpectType<typeof result, "json", "strict">;
