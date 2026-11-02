/**
 * @title createGridTemplates
 *
 * Configurer les templates Vue en grille et leurs commandes.
 */
import { createForm } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";

// La configuration Grid exige les options repeat, step et union, même si le formulaire ne les utilise pas.
// Les options form, input, multi, check et section peuvent être omises.
const grid = createGridTemplates({
	repeat: {
		addLabel: "Add",
		removeLabel: "Remove",
		addButton: templateFormAddButton,
		removeButton: templateFormRemoveButton,
		resetButton: templateFormResetButton,
	},
	step: {
		nextLabel: "Continue",
		previousLabel: "Back",
		nextButton: templateFormNextButton,
		previousButton: templateFormPreviousButton,
		resetButton: templateFormResetButton,
	},
	union: { selectInputKind: templateFormSelect },
	input: { columns: 6 },
});

// Ensemble complet pour createForm.
const useForm = createForm(grid.useTemplates());
const { component: TheForm } = useForm(
	useTextInput({
		label: "Title",
		// Surcharge locale de la configuration input.
		template: grid.useInputTemplate({ columns: 12 }),
	}),
);
