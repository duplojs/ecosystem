/**
 * @title Personnaliser les templates
 *
 * Personnalisation globale ou locale du rendu Vue des formulaires et de leurs champs.
 */
import { createForm, createTemplate, useMultiLayout, type InputTemplateProperties, type VueComponent } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextareaInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";

// Un template transforme les props système et les slots en interface Vue.
// Il reste générique : la connaissance métier appartient au formulaire.
// Remplacer le template change le rendu ; la structure des champs, leurs
// validations et leurs valeurs restent définies par les inputs et les layouts.
interface HeroInputTemplateProperties {
	props: (
		& InputTemplateProperties["props"]
		& {
			tone?: "default" | "accent";
		}
	);
	slots: InputTemplateProperties["slots"];
}

declare const HeroInputTemplate: VueComponent<HeroInputTemplateProperties>;

// La clé `"input"` indique quelle partie du rendu est remplacée.
const useHeroInputTemplate = createTemplate(
	"input",
	HeroInputTemplate,
	{
		props: {
			tone: "default",
		},
	},
);

// Les templates grid fournissent une base visuelle remplaçable globalement
// ou localement.
const gridTemplates = createGridTemplates({
	repeat: {
		addLabel: "Add another item",
		removeLabel: "Remove this item",
		addButton: templateFormAddButton,
		removeButton: templateFormRemoveButton,
		resetButton: templateFormResetButton,
	},
	step: {
		nextLabel: "Continue",
		previousLabel: "Back",
		resetButton: templateFormResetButton,
		nextButton: templateFormNextButton,
		previousButton: templateFormPreviousButton,
	},
	union: { selectInputKind: templateFormSelect },
});

// La surcharge globale s'applique à tous les champs concernés par ce formulaire.
const useForm = createForm({
	...gridTemplates.useTemplates(),
	input: useHeroInputTemplate({ tone: "accent" }),
});

const { component: TheForm, currentValue } = useForm(
	useMultiLayout({
		title: useTextInput({
			label: "Title",
		}),
		subtitle: useTextInput({
			label: "Subtitle",
			template: useHeroInputTemplate({ tone: "default" }),
		}),
		summary: useTextareaInput({
			label: "Summary",
			template: gridTemplates.useInputTemplate({
				columns: 12,
			}),
		}),
	}),
);

// `title` utilise le template global, `subtitle` le surcharge localement,
// `summary` revient au template grid.
//
// Ref<{
//   title: string;
//   subtitle: string;
//   summary: string;
// }>
void currentValue;
