import { createGridTemplates } from "@duplojs/form/vueGrid";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect } from "@duplojs/form/vueDesignSystem";

export const grid = createGridTemplates({
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
});
