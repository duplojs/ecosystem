/**
 * @title useSelectInput
 *
 * Choisir une option dans une liste déroulante.
 */
import { useSelectInput } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";

// La sélection initiale est null.
const priority = useSelectInput({
	label: "Priority",
	props: {
		options: [
			{
				label: "High",
				value: "high",
			},
			{
				label: "Low",
				value: "low",
			},
		],
	},
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof priority>,
	string | null,
	"strict"
>;
