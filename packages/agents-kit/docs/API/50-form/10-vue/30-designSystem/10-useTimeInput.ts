/**
 * @title useTimeInput
 *
 * Choisir une heure Chrono.
 */
import { useTimeInput } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";
import type * as DChrono from "@duplojs/lang/chrono";

// La valeur initiale correspond à zéro seconde.
const time = useTimeInput({
	label: "Opening time",
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof time>,
	DChrono.TheTime | DChrono.SerializedTheTime | null,
	"strict"
>;
