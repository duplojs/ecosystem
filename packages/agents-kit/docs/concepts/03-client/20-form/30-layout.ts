/**
 * @title Composer avec les layouts
 *
 * Composition de la structure des données et des comportements d’un formulaire.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import { createForm, type DetailsError, useCheckLayout, useDisabledLayout, useMultiLayout, useRepeatLayout, useSectionLayout, useSlotLayout, useStepLayout, useUnionLayout } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextareaInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";
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
// Un layout reçoit un ou plusieurs champs et produit un nouveau `FormField`.
// Ici, les inputs sont composés dans des layouts, eux-mêmes imbriqués dans
// `useMultiLayout`, puis `useSectionLayout` fournit le champ racine à `useForm`.
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

type _CheckContacts = DCommon.ExpectType<typeof currentStructureValue.value.contacts, [string, ...string[]], "strict">;
type _CheckPreferredContactKind = DCommon.ExpectType<
	typeof currentStructureValue.value.preferredContact.kind,
	"email" | "phone",
	"strict"
>;
void currentStructureValue;

const checkedStructureValue = await checkStructureForm();
type _CheckCheckedStructureValueLine96 = DCommon.ExpectType<
	typeof checkedStructureValue,
	DEither.Error<DetailsError> | DEither.Success<{
		identity: {
			firstName: string;
			lastName: string;
		};
		contacts: [string, ...string[]];
		preferredContact: {
			kind: "email";
			value: string;
		} | {
			kind: "phone";
			value: string;
		};
		message: string | undefined;
	}>,
	"strict"
>;

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

type _CheckCurrentStep = DCommon.ExpectType<typeof currentFlowValue.value.currentStep, 0 | 1, "strict">;
void currentFlowValue;

const checkedFlowValue = await checkFlowForm();
type _CheckCheckedFlowValueLine160 = DCommon.ExpectType<
	typeof checkedFlowValue,
	DEither.Error<DetailsError> | DEither.Success<readonly [
		{
			fullName: string;
			email: string & DString.Email;
		},
		{
			company: string | undefined;
			notes: string;
		},
	]>,
	"strict"
>;
