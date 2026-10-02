/**
 * @title Créer un formulaire
 *
 * `@duplojs/form` permet de composer un formulaire par déclaration.
 *
 * Au lieu de piloter impérativement chaque interaction du formulaire,
 * on exprime sa structure et ses comportements avec des fonctions.
 *
 * L'initialisation se fait en deux temps :
 * - fabriquer une fonction `useForm` avec `createForm`
 * - passer à cette fonction un `FormField` racine
 *
 * Le point important est qu'un input retourne un `FormField`, et qu'un layout
 * retourne aussi un `FormField`. Le champ racine peut donc être un input simple
 * ou une composition de layouts et d'inputs.
 *
 * `createForm` ne connaît pas le schéma métier du formulaire.
 * Il reçoit les templates disponibles, clone la `defaultValue` du champ racine,
 * instancie la composition sur un état Vue, puis expose le composant et les
 * opérations du formulaire.
 */
import { createForm, useCheckLayout, useMultiLayout } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useNumberInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Avant de créer `useForm`, il faut préparer les templates.
// `createGridTemplates` est le helper du grid system pour construire cette
// configuration à partir de composants Vue.
//
// `repeat`, `step` et `union` sont les templates minimums à configurer,
// car ces layouts de structure ont besoin de composants dédiés pour ajouter,
// retirer, changer d'étape ou sélectionner une variante.
// Les autres templates peuvent aussi être configurés ici si l'application
// veut remplacer les rendus par défaut.
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

// `useForm` initialise un `FormField` racine.
// Ici, le champ racine est un `useMultiLayout`, mais il pourrait aussi être
// directement un input.
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

// `currentValue` est une `Ref` Vue synchronisée avec la composition du formulaire.
// Elle contient toujours la valeur brute actuellement éditée.
// Ref<{
//   name: string;
//   email: string;
//   age: number;
// }>
void currentValue;

// `check` exécute uniquement les vérifications déclarées par les inputs
// ou les layouts de validation. Les `DataStructure` peuvent alors contraindre
// le typage de la valeur validée.
// DEither.Error<DetailsError> | DEither.Success<{
//   name: string;
//   email: string & Email;
//   age: number;
// }>
const checkedValue = await check();

void checkedValue;

// `reset` restaure les `defaultValue` des champs et nettoie les états internes
// exposés par les inputs ou layouts.
reset();

// `dispose` libère les scopes internes créés par le formulaire.
// Il est généralement appelé au démontage du composant qui utilise le form.
dispose();

// `component` est le composant Vue à monter dans le markup.
// Le handler de submit est libre, mais le bouton de submit doit être fourni
// par l'application.
void TheForm;

/**
 * <TheForm @submit="() => console.log(check())">
 *   <PrimaryButton type="submit" label="Submit" />
 * </TheForm>
 */
