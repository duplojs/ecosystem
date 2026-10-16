/**
 * @title DCommon.toNative
 *
 * Transformer récursivement les valeurs DuploJS qui exposent `toNative`.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.toNative({
	toNative() {
		return "native" as const;
	},
});

// La méthode toNative est appelée sur la valeur fournie.
type _CheckResult = DCommon.ExpectType<typeof result, "native", "strict">;
