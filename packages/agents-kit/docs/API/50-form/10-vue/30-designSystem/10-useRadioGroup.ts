/**
 * @title useRadioGroup
 *
 * Choisir une option avec des boutons radio.
 */
import { useRadioGroup } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";

// La sélection initiale est null.
const frequency = useRadioGroup({
	label: "Frequency",
	props: {
		options: [
			{
				label: "Daily",
				value: "daily",
			},
			{
				label: "Weekly",
				value: "weekly",
			},
		],
	},
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof frequency>,
	string | null,
	"strict"
>;
