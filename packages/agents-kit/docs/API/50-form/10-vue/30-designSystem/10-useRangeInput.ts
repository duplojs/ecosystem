/**
 * @title useRangeInput
 *
 * Choisir un nombre avec un curseur.
 */
import { useRangeInput } from "@duplojs/form/vueDesignSystem";

// La valeur initiale est zéro ; les bornes configurent le curseur.
const volume = useRangeInput({
	label: "Volume",
	props: {
		min: 0,
		max: 100,
		step: 5,
	},
});

void volume;
