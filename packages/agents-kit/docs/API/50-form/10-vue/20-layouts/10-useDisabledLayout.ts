/**
 * @title useDisabledLayout
 *
 * Retirer conditionnellement un champ du rendu et de la validation.
 */
import { useDisabledLayout, type GetFormFieldCheckedValue, type GetFormFieldValue } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";
import { ref } from "vue";

const isGuest = ref(true);

const company = useDisabledLayout(
	useTextInput({
		label: "Company",
	}),
	{
		isDisabled: () => isGuest.value,
	},
);

// Le modèle garde la saisie pendant que le champ est masqué.
type _Raw = DCommon.ExpectType<
	GetFormFieldValue<typeof company>,
	string,
	"strict"
>;

// Lorsque isDisabled retourne true, check ne valide pas l'enfant et réussit avec undefined.
type _Checked = DCommon.ExpectType<
	GetFormFieldCheckedValue<typeof company>,
	string | undefined,
	"strict"
>;
