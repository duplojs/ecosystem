import { createForm, useMultiLayout, useUnionLayout } from "@duplojs/form/vue";
import { templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextareaInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import { createGridTemplates } from "@duplojs/form/vueGrid";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { computed, onScopeDispose, ref } from "vue";

const templates = createGridTemplates({
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

const useForm = createForm(templates.useTemplates());

export function usePostModeration() {
	const { component: ModerationForm, currentValue, check, dispose } = useForm(
		useUnionLayout(
			[
				["approve", useTextInput({ label: "Public note" })],
				[
					"reject",
					useMultiLayout({
						reason: useTextareaInput({
							label: "Reason for rejection",
							dataStructure: DDataStructure.string([DDataStructure.minCharacters(1)]),
						}),
					}),
				],
			],
			{ defaultKind: "approve" },
		),
	);
	const selectedDecision = computed(() => currentValue.value.kind);
	const submitted = ref("");

	function selectApproval() {
		currentValue.value.updateKind("approve");
	}

	function selectRejection() {
		currentValue.value.updateKind("reject");
	}

	async function submit() {
		submitted.value = "";
		const result = await check();

		if (DEither.isRight(result)) {
			const decision = DEither.unwrapRight(result);

			submitted.value = decision.kind === "approve"
				? `Approved: ${decision.value}`
				: `Rejected: ${decision.value.reason}`;
		}
	}

	onScopeDispose(dispose);

	return {
		ModerationForm,
		selectedDecision,
		submitted,
		selectApproval,
		selectRejection,
		submit,
	};
}
