/**
 * @title useTextInput
 *
 * Saisir un texte court.
 */
import { useTextInput } from "@duplojs/form/vueDesignSystem";

// Une chaîne vide est utilisée initialement.
const title = useTextInput({
	label: "Title",
	props: { placeholder: "Article title" },
});

void title;
