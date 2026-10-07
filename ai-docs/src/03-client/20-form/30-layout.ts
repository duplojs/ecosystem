/**
 * @title Composer avec les layouts
 *
 * Un layout reçoit un ou plusieurs champs et retourne un nouveau champ.
 *
 * C'est ce qui permet de construire un formulaire par composition : un input
 * peut être donné à un layout, ce layout peut être donné à un autre layout,
 * puis le résultat final devient le champ racine passé à `useForm`.
 *
 * Les layouts structurent la valeur du formulaire ou pilotent un comportement
 * autour d'un ou plusieurs champs.
 */
import { createForm, useCheckLayout, useDisabledLayout, useMultiLayout, useRepeatLayout, useSectionLayout, useSlotLayout, useStepLayout, useUnionLayout } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextareaInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { ref } from "vue";

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

// Les layouts de structure modifient directement la forme de `currentValue`
// et la forme de la valeur retournée par `check`.
const { check: checkStructureForm, component: StructureForm, currentValue: currentStructureValue } = useForm(
	useSectionLayout(
		useMultiLayout({
			identity: useMultiLayout({
				firstName: useTextInput({ label: "First name" }),
				lastName: useTextInput({ label: "Last name" }),
			}),
			contacts: useRepeatLayout(
				useTextInput({ label: "Email" }),
				{
					min: 1,
					max: 3,
				},
			),
			preferredContact: useUnionLayout(
				[
					["email", useTextInput({ label: "Email" })],
					["phone", useTextInput({ label: "Phone" })],
				],
				{ defaultKind: "email" },
			),
			message: useSlotLayout(
				"customMessage",
				useTextareaInput({ label: "Message" }),
			),
		}),
		{ title: "Profile" },
	),
);

// Ref<{
//   identity: {
//     firstName: string;
//     lastName: string;
//   };
//   contacts: [string, ...string[]];
//   preferredContact: {
//     readonly kind: "email" | "phone";
//     value: string;
//     updateKind(kind: "email" | "phone", value?: string): void;
//   };
//   message: string;
// }>
void currentStructureValue;

// DEither.Error<DetailsError> | DEither.Success<{
//   identity: {
//     firstName: string;
//     lastName: string;
//   };
//   contacts: [string, ...string[]];
//   preferredContact: {
//     kind: "email" | "phone";
//     value: string;
//   };
//   message: string | undefined;
// }>
const checkedStructureValue = await checkStructureForm();

void checkedStructureValue;
void StructureForm;

const hasCompany = ref(false);

// Les layouts de contrôle changent surtout le flux du formulaire.
// `step` impose une progression, `check` ajoute une validation autour d'un
// champ existant, et `disabled` retire temporairement un champ du rendu et
// de la valeur validée.
const { check: checkFlowForm, component: FlowForm, currentValue: currentFlowValue } = useForm(
	useStepLayout(
		[
			useMultiLayout({
				fullName: useTextInput({ label: "Full name" }),
				email: useCheckLayout(
					useTextInput({ label: "Email" }),
					{
						dataStructure: DDataStructure.string([DDataStructure.email()]),
					},
				),
			}),
			useMultiLayout({
				company: useDisabledLayout(
					useTextInput({ label: "Company" }),
					{
						isDisabled: () => !hasCompany.value,
					},
				),
				notes: useTextareaInput({ label: "Notes" }),
			}),
		],
		{
			errorMessageNotAtLastStep: "Complete all steps before submitting.",
		},
	),
);

// Ref<{
//   currentStep: 0 | 1;
//   steps: [
//     {
//       fullName: string;
//       email: string;
//     },
//     {
//       company: string;
//       notes: string;
//     },
//   ];
// }>
void currentFlowValue;

// DEither.Error<DetailsError> | DEither.Success<[
//   {
//     fullName: string;
//     email: string & Email;
//   },
//   {
//     company: string | undefined;
//     notes: string;
//   },
// ]>
const checkedFlowValue = await checkFlowForm();
