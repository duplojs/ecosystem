/**
 * @title Créer/Utiliser un input
 *
 * Un composant Vue d'input n'est pas encore une brique de formulaire.
 *
 * La séquence est :
 * - écrire un composant Vue compatible
 * - le transformer en factory avec `createInput`
 * - appeler cette factory pour obtenir un `FormField`
 * - composer ce `FormField` dans un formulaire
 *
 * Cette séparation permet de garder le composant concentré sur l'interface,
 * et de laisser `@duplojs/form` gérer son intégration dans `currentValue`,
 * `reset`, `dispose` et `check`.
 *
 * Le design system Vue expose déjà des factories prêtes à utiliser pour les
 * inputs courants. `createInput` sert quand une application veut créer les
 * siennes.
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

// Les inputs du design system sont déjà des factories.
// Ils retournent donc directement des `FormField`.
// Les props disponibles sont inférées depuis leur composant Vue.
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

// `createInput` transforme un composant Vue compatible en factory.
// Le contrat minimal du composant est de porter une valeur avec `modelValue`
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
// `props` permet de fixer des props par défaut pour le composant.
// Si le composant déclare des props obligatoires, TypeScript oblige à les
// fournir ici ou lors de l'utilisation de la factory.

// Les paramètres passés à l'utilisation complètent ou remplacent ensuite
// les valeurs par défaut de la factory.
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

// Un composant d'input peut exposer sa propre logique de validation avec
// `defineExpose<ExposeInputProperties>({ check, reset, dispose })`.
// Lors du `check`, la librairie appelle d'abord le `check` exposé par le
// composant s'il existe, puis applique la `dataStructure` de l'input.
// DEither.Error<DetailsError> | DEither.Success<string & Email>
const checkedEmail = await check();

void checkedEmail;
