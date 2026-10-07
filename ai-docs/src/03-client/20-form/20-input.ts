/**
 * @title Créer/Utiliser un input
 *
 * Un composant Vue d'input n'est pas encore une brique de formulaire.
 *
 * Pour créer un input réutilisable, le raisonnement est toujours le même :
 * partir d'un composant Vue compatible, le transformer avec `createInput`,
 * puis composer le champ obtenu dans un formulaire.
 *
 * Les inputs du design system suivent déjà ce modèle. Ils peuvent être utilisés
 * directement, ou servir de référence lorsqu'une application crée ses propres
 * inputs.
 */
import { createForm, createInput, useMultiLayout } from "@duplojs/form/vue";
import { TextInput, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useNumberInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";
import * as DDataStructure from "@duplojs/lang/dataStructure";

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

// Les inputs du design system sont déjà des briques de formulaire.
// Ils retournent directement des champs composables dans `useForm`, avec des
// props inférées depuis leur composant Vue.
const { component: TheForm, currentValue } = useForm(
	useMultiLayout({
		name: useTextInput({
			label: "Name",
			props: {
				placeholder: "Your name",
			},
		}),
		age: useNumberInput({
			label: "Age",
			defaultValue: 18,
		}),
	}),
);

// Ref<{
//   name: string;
//   age: number;
// }>
void currentValue;
void TheForm;

// `createInput` transforme un composant Vue compatible en input de formulaire.
// Le contrat minimal du composant est de porter sa valeur avec `modelValue`
// et `update:modelValue`. Il peut aussi exposer `check`, `reset` ou `dispose`
// si son comportement interne en a besoin.
const useCustomTextInput = createInput(
	TextInput,
	{
		defaultValue: "custom text",
		props: {
			placeholder: "Your text",
		},
	},
);

// `defaultValue` est obligatoire : c'est la valeur initiale de l'input.
// Elle peut être une valeur directe ou une fonction.
// Les paramètres passés à l'utilisation complètent ou remplacent ensuite
// les valeurs par défaut de `createInput`.
const { check } = useForm(
	useCustomTextInput({
		label: "Email",
		defaultValue: "",
		props: {
			placeholder: "yourEmail@mail.com",
		},
		dataStructure: DDataStructure.string([DDataStructure.email()]),
	}),
);

// Lors du `check`, la librairie appelle d'abord le `check` exposé par le
// composant s'il existe, puis applique la `dataStructure` de l'input.
// DEither.Error<DetailsError> | DEither.Success<string & Email>
const checkedEmail = await check();

void checkedEmail;
