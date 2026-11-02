/**
 * @title useCheckbox
 *
 * Saisir une valeur booléenne avec une case.
 */
import { useCheckbox } from "@duplojs/form/vueDesignSystem";

// La case est initialement décochée.
const newsletter = useCheckbox({
	label: "Subscribe to updates",
});

void newsletter;
