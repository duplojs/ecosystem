/**
 * @title Personnaliser les templates
 *
 * Les templates définissent le rendu des formulaires, des inputs et des
 * layouts.
 *
 * Ils ne changent ni la structure de `currentValue`, ni la valeur retournée
 * par `check`. Leur rôle est de transformer les props système et les slots
 * fournis par `@duplojs/form` en interface Vue.
 *
 * Le découpage mental est simple :
 * - les `FormField` décrivent la structure
 * - les layouts composent cette structure
 * - les templates rendent cette structure
 */
import { createForm, createTemplate, useMultiLayout, type InputTemplateProperties, type VueComponent } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextareaInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";

// Un template reçoit des props système, comme `fieldKey`, `getLabel`,
// `getErrorMessage`, et des slots, comme `input` ou `formField`.
// Il doit rester générique : s'il connaît `firstName`, `age` ou une structure
// métier précise, ce n'est plus un template mais de la logique de formulaire.
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

// `createTemplate` transforme un composant Vue compatible en factory.
// La clé `"input"` indique quel type de template est remplacé.
const useHeroInputTemplate = createTemplate(
	"input",
	HeroInputTemplate,
	{
		props: {
			tone: "default",
		},
	},
);

// Les templates grid de `@duplojs/form/vueGrid` sont une implémentation prête
// à l'emploi pour les templates standards du formulaire.
// Ils donnent une base visuelle cohérente, mais restent remplaçables
// globalement ou localement.
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

// Une surcharge globale remplace le template pour tous les champs concernés
// par cette factory de formulaire.
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

// `title` utilise le template global accentué.
// `subtitle` surcharge localement ce template.
// `summary` revient localement sur le template grid.
//
// Ref<{
//   title: string;
//   subtitle: string;
//   summary: string;
// }>
void currentValue;
