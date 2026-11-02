/**
 * @title useStepLayout
 *
 * Répartir des champs dans un parcours à étapes.
 */
import { useStepLayout, type GetFormFieldCheckedValue, type GetFormFieldValue } from "@duplojs/form/vue";
import { useNumberInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";

const registration = useStepLayout(
	[
		useTextInput({ label: "Name" }),
		useNumberInput({ label: "Age" }),
	],
	{ errorMessageNotAtLastStep: "Complete all steps" },
);

// Le check final refuse une soumission avant la dernière étape et revient à la première étape invalide.
type _Raw = DCommon.ExpectType<
	GetFormFieldValue<typeof registration>,
	{
		currentStep: 0 | 1;
		steps: [string, number];
	},
	"strict"
>;
type _Checked = DCommon.ExpectType<
	GetFormFieldCheckedValue<typeof registration>,
	readonly [string, number],
	"strict"
>;
