/**
 * @title Créer un formulaire
 *
 * Initialisation d'un formulaire à partir de templates et d'un `FormField`
 * racine pour obtenir son composant Vue, sa valeur courante et ses opérations.
 */
import { createForm, useCheckLayout, useMultiLayout } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useNumberInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// `createForm` fixe le système de rendu utilisé par cette famille de formulaires.
// `repeat`, `step` et `union` demandent des composants dédiés pour ajouter,
// retirer, changer d'étape ou sélectionner une variante.
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

const useForm = createForm(
	gridTemplates.useTemplates(),
);

// Le champ racine porte le schéma métier du formulaire.
// Il peut être un input simple ou une composition de layouts et d'inputs.
const { check, component: TheForm, currentValue, dispose, reset } = useForm(
	useMultiLayout({
		name: useTextInput({
			label: "Name",
			props: {
				placeholder: "Your name",
			},
		}),
		email: useCheckLayout(
			useTextInput({
				label: "Email",
				props: {
					placeholder: "yourEmail@mail.com",
				},
			}),
			{
				dataStructure: DDataStructure.string([DDataStructure.email()]),
			},
		),
		age: useNumberInput({
			label: "Age",
			defaultValue: 18,
		}),
	}),
);

// Valeur brute synchronisée avec l'état Vue du formulaire.
// Ref<{
//   name: string;
//   email: string;
//   age: number;
// }>
void currentValue;

// `check` applique les validations déclarées et type la valeur validée.
// DEither.Error<DetailsError> | DEither.Success<{
//   name: string;
//   email: string & Email;
//   age: number;
// }>
const checkedValue = await check();

void checkedValue;

// `reset` restaure les `defaultValue` et les états internes des champs.
reset();

// `dispose` libère les scopes internes, généralement au démontage.
dispose();

// `component` est le composant Vue à monter ; le submit reste applicatif.
void TheForm;

// <TheForm @submit="() => console.log(check())">
//   <PrimaryButton type="submit" label="Submit" />
// </TheForm>
