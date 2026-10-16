/**
 * @title DCommon.transformer
 *
 * Appliquer récursivement une méthode sans argument aux objets, tableaux et valeurs imbriqués.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.transformer(
	{
		value: {
			toNative() {
				return 42 as const;
			},
		},
	},
	"toNative",
);

// Les objets imbriqués sont transformés récursivement.
type _CheckResult = DCommon.ExpectType<typeof result, { value: 42 }, "strict">;

