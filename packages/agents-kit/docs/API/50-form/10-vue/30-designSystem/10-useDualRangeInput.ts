/**
 * @title useDualRangeInput
 *
 * Choisir les deux extrémités numériques d’une plage.
 */
import { useDualRangeInput } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";

// La plage initiale est { start: 0, end: 100 }.
const price = useDualRangeInput({
	label: "Price range",
	props: {
		min: 0,
		max: 100,
		step: 5,
	},
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof price>,
	{
		start: number;
		end: number;
	},
	"strict"
>;
