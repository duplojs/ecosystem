/**
 * @title useTextareaInput
 *
 * Saisir un texte multiligne.
 */
import { useTextareaInput } from "@duplojs/form/vueDesignSystem";

// La valeur initiale est une chaîne vide.
const description = useTextareaInput({
	label: "Description",
	props: { placeholder: "Describe the issue" },
});

void description;
