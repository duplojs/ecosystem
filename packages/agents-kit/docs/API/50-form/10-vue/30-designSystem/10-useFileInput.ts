/**
 * @title useFileInput
 *
 * Sélectionner un ou plusieurs fichiers.
 */
import { useFileInput } from "@duplojs/form/vueDesignSystem";
import type { GetFormFieldValue } from "@duplojs/form/vue";
import type * as DCommon from "@duplojs/lang/common";

// La valeur initiale est null ; le composant accepte une liste de fichiers.
const attachments = useFileInput({
	label: "Attachments",
	props: {
		accept: ".pdf",
		multiple: true,
	},
});

type _Value = DCommon.ExpectType<
	GetFormFieldValue<typeof attachments>,
	File[] | null,
	"strict"
>;
