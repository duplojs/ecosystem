/**
 * @title useSectionLayout
 *
 * Présenter un champ dans une section sans modifier sa valeur.
 */
import { useSectionLayout, type GetFormFieldValue } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";

const section = useSectionLayout(
	useTextInput({ label: "Name" }),
	{ title: "Profile" },
);

// La section change le rendu sans modifier le modèle ou le résultat validé.
type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof section>,
	string,
	"strict"
>;
