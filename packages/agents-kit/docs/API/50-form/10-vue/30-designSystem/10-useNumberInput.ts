/**
 * @title useNumberInput
 *
 * Saisir un nombre.
 */
import { useNumberInput } from "@duplojs/form/vueDesignSystem";

// La valeur initiale est zéro ; les bornes configurent le composant.
const quantity = useNumberInput({
	label: "Quantity",
	props: {
		min: 0,
		max: 100,
		step: 1,
	},
});

void quantity;
