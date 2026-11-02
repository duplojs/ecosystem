/**
 * @title useRangeDateInput
 *
 * Choisir un intervalle de dates Chrono.
 */
import { useRangeDateInput } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";
import type * as DChrono from "@duplojs/lang/chrono";

// La valeur comporte from et to ; les dates initiales sont le jour courant et le lendemain.
const period = useRangeDateInput({
	label: "Booking period",
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof period>,
	{
		from: DChrono.TheDate | DChrono.SerializedTheDate | null;
		to: DChrono.TheDate | DChrono.SerializedTheDate | null;
	},
	"strict"
>;
