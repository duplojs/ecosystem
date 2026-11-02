/**
 * @title useRangeTimeInput
 *
 * Choisir un intervalle d’heures Chrono.
 */
import { useRangeTimeInput } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";
import type * as DChrono from "@duplojs/lang/chrono";

// La valeur comporte from et to, initialisées à zéro seconde.
const hours = useRangeTimeInput({
	label: "Opening hours",
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof hours>,
	{
		from: DChrono.TheTime | DChrono.SerializedTheTime | null;
		to: DChrono.TheTime | DChrono.SerializedTheTime | null;
	},
	"strict"
>;
