/**
 * @title useDateInput
 *
 * Choisir une date Chrono.
 */
import { useDateInput } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";
import type * as DChrono from "@duplojs/lang/chrono";

// La date initiale est calculée avec DChrono.now() à la création du champ.
const date = useDateInput({
	label: "Appointment date",
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof date>,
	DChrono.TheDate | DChrono.SerializedTheDate | null,
	"strict"
>;
